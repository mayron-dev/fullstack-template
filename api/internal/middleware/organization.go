package middleware

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mayron1806/go-api/config"
	"github.com/mayron1806/go-api/internal/helper"
	"github.com/mayron1806/go-api/internal/model"
	"gorm.io/gorm"
)

func OrganizationMiddleware(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// verifica se o grupo esta presente nos cookies
		organizationId, err := c.Cookie("organization-code")
		if err != nil && err != http.ErrNoCookie {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			c.Abort()
			return
		}
		if organizationId == "" {
			// pega a organização pelo usuario
			claims := helper.GetAuthClaims(c)
			if claims == nil {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
				c.Abort()
				return
			}
			userId := claims.Data.UserID
			var user model.User
			err := db.Where("id = ?", userId).Preload("Members").First(&user).Error
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				c.Abort()
				return
			}

			if len(user.Members) == 0 {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
				c.Abort()
				return
			}

			if len(user.Members) > 1 {
				c.Redirect(http.StatusFound, fmt.Sprintf("%s/", config.GetEnv().CLIENT_URL))
				return
			}

			organizationId = user.Members[0].OrganizationID
			configs := config.GetEnv()
			c.SetCookie(
				"organization-code",
				organizationId,
				3600,
				configs.COOKIES_PATH,
				configs.COOKIES_DOMAIN,
				configs.COOKIES_SECURE,
				configs.COOKIES_HTTP_ONLY,
			)
		}
		c.Next()
	}
}
