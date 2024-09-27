package auth

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/mayron1806/go-api/internal/goauth2"
	"github.com/mayron1806/go-api/internal/model"
)

func (h *AuthHandler) OAuthCallback(c *gin.Context) {
	provider := c.Param("provider")
	authorizedToken, err := goauth2.Authorize(provider, c.Request.URL.Query())
	if err != nil {
		h.ResponseError(c, http.StatusBadRequest, "error authorizing: %s", err.Error())
		return
	}

	var userWithEmail model.User
	err = h.db.
		Preload("Providers").
		Preload("Account").
		Attrs(model.User{
			Name:      authorizedToken.Name,
			Email:     authorizedToken.Email,
			Avatar:    authorizedToken.Avatar,
			Challenge: model.UserChallengeNone,
		}).
		FirstOrCreate(&userWithEmail, "users.email = ?", authorizedToken.Email).
		Error
	if err != nil {
		h.ResponseError(c, http.StatusBadRequest, "error authorizing: %s", err.Error())
		return
	}
	// cria conta se não existe
	if userWithEmail.Account.ID == "" {
		userWithEmail.Account = model.Account{Active: true}
		if err := h.db.Save(&userWithEmail).Error; err != nil {
			h.ResponseError(c, http.StatusBadRequest, "error authorizing: %s", err.Error())
			return
		}
	}

	// add provider if not found
	var socialProvider model.SocialProvider
	err = h.db.
		Where("provider = ? AND user_id = ?", provider, userWithEmail.ID).
		Attrs(model.SocialProvider{
			Email:         authorizedToken.Email,
			EmailVerified: true,
			Active:        true,
			Provider:      provider,
			ProviderID:    authorizedToken.ProviderID,
			Avatar:        authorizedToken.Avatar,
			UserID:        userWithEmail.ID,
		}).FirstOrCreate(&socialProvider).Error

	if err != nil {
		h.ResponseError(c, http.StatusBadRequest, "error authorizing: %s", err.Error())
		return
	}

	// generate tokens
	tokens, err := h.authService.GenerateTokens(
		&userWithEmail,
		socialProvider.Provider,
		&model.RefreshTokenPayload{Type: socialProvider.Provider, Oauth: *authorizedToken},
	)

	h.SetTokenCookies(c, tokens)
	h.SetUserCookies(c, userWithEmail, int(tokens.RefreshToken.ExpiresAt.Sub(time.Now()).Seconds()))
	if h.clientURL == "" {
		c.JSON(http.StatusOK, tokens)
		return
	}
	c.Redirect(http.StatusFound, fmt.Sprintf("%s/", h.clientURL))
}
