package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mayron1806/go-api/config"
	"github.com/mayron1806/go-api/internal/helper"
	"github.com/mayron1806/go-api/internal/services"
)

func AccountMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		accountId, err := helper.CleanUUID(c.Param("accountId"))
		logger := config.GetLogger("Middleware")
		logger.Debugf("accountId: %s", accountId)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid account ID"})
			c.Abort()
			return
		}
		// Adiciona os claims ao contexto para serem usados nos handlers
		cl, ok := c.Get("claims")
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		claims, ok := cl.(services.JWTClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}
		logger.Debugf("accountId: %s", claims.Data.AccountID)
		if claims.Data.AccountID != accountId.String() {
			c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
			c.Abort()
			return
		}
		c.Next()
	}
}
