package router

import (
	"github.com/gin-gonic/gin"
	"github.com/mayron1806/go-api/internal/handler/auth"
)

func registerRoutes(router *gin.Engine) {
	apiGroup := router.Group("/api")

	authGroup := apiGroup.Group("/auth")
	authHandler := auth.NewAuthHandler()
	authHandler.Register(authGroup)

	// authService := services.NewAuthService()
	// accountGroup.Use(middleware.AuthMiddleware(authService))
	// accountGroup.Use(middleware.AccountMiddleware())

}
