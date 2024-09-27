package services

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/mayron1806/go-api/config"
	"github.com/mayron1806/go-api/internal/model"
	"gorm.io/gorm"
)

type TokenType string
type JWTData struct {
	UserID    uint           `json:"user_id"`
	AccountID string         `json:"account_id"`
	Provider  string         `json:"provider"`
	Email     string         `json:"email"`
	Type      model.UserType `json:"type"`
	Plan      string         `json:"plan"`
}
type JWTClaims struct {
	jwt.StandardClaims
	ExpiresAt int64   `json:"exp"`
	IssuedAt  int64   `json:"iat"`
	Issuer    string  `json:"iss"`
	Data      JWTData `json:"data"`
}
type AuthService struct {
	db                   *gorm.DB
	accessTokenDuration  time.Duration
	refreshTokenDuration time.Duration
	secret               string
	issuer               string
	logger               *config.Logger
}

func NewAuthService() *AuthService {
	env := config.GetEnv()
	accessTokenDuration := time.Second * time.Duration(env.JWT_ACCESS_TOKEN_DURATION)
	refreshTokenDuration := time.Second * time.Duration(env.JWT_REFRESH_TOKEN_DURATION)
	db := config.GetDatabase()
	logger := config.GetLogger("auth service")
	return &AuthService{
		accessTokenDuration:  accessTokenDuration,
		refreshTokenDuration: refreshTokenDuration,
		issuer:               env.JWT_ISSUER,
		secret:               env.JWT_SECRET,
		db:                   db,
		logger:               logger,
	}
}

type TokenResponse struct {
	Token     string    `json:"token"`
	ExpiresAt time.Time `json:"expiresAt"`
}
type GenerateTokensResponse struct {
	AccessToken  TokenResponse `json:"accessToken"`
	RefreshToken TokenResponse `json:"refreshToken"`
}

func (s *AuthService) GenerateAccessToken(user *model.User, provider string) (TokenResponse, error) {
	expiresAt := time.Now().Add(s.accessTokenDuration)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &JWTClaims{
		ExpiresAt: expiresAt.Unix(),
		IssuedAt:  time.Now().Unix(),
		Issuer:    s.issuer,
		Data: JWTData{
			UserID:    user.ID,
			Provider:  provider,
			Type:      user.Type,
			Email:     user.Email,
			AccountID: user.Account.ID,
			Plan:      user.Account.Plan,
		},
	})
	signedToken, err := token.SignedString([]byte(s.secret))
	if err != nil {
		return TokenResponse{}, err
	}
	return TokenResponse{
		Token:     signedToken,
		ExpiresAt: expiresAt,
	}, nil
}

func (s *AuthService) GenerateTokens(user *model.User, provider string, refreshPayload *model.RefreshTokenPayload) (GenerateTokensResponse, error) {
	accessToken, err := s.GenerateAccessToken(user, provider)
	if err != nil {
		return GenerateTokensResponse{}, err
	}
	refreshToken := model.Token{
		Key:       uuid.New(),
		UserID:    user.ID,
		Type:      model.RefreshToken,
		Payload:   refreshPayload,
		ExpiresAt: time.Now().Add(s.refreshTokenDuration),
	}
	err = s.db.Create(&refreshToken).Error
	if err != nil {
		return GenerateTokensResponse{}, err
	}

	return GenerateTokensResponse{
		AccessToken: accessToken,
		RefreshToken: TokenResponse{
			Token:     refreshToken.Key.String(),
			ExpiresAt: refreshToken.ExpiresAt,
		},
	}, nil
}
func (s *AuthService) ValidateJWT(token string) (JWTClaims, error) {
	parsedToken, err := jwt.ParseWithClaims(token, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(s.secret), nil
	})
	if err != nil {
		return JWTClaims{}, err
	}

	if claims, ok := parsedToken.Claims.(*JWTClaims); ok && parsedToken.Valid {
		return *claims, nil
	}
	return JWTClaims{}, errors.New("invalid token")
}
