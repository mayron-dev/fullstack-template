package router

import (
	"github.com/gin-gonic/gin"
	"github.com/mayron1806/go-api/internal/handler/auth"
	"github.com/mayron1806/go-api/internal/handler/organization"
	"github.com/mayron1806/go-api/internal/middleware"
	"github.com/mayron1806/go-api/internal/services"
)

func registerRoutes(router *gin.Engine) {
	apiOrganization := router.Group("/api")

	authOrganization := apiOrganization.Group("/auth")
	authHandler := auth.NewAuthHandler()
	authHandler.Register(authOrganization)

	authService := services.NewAuthService()
	organizationGroup := apiOrganization.Group("/organization")
	organizationGroup.Use(middleware.AuthMiddleware(authService))

	organizationHandler := organization.NewOrganizationHandler()
	organizationHandler.Register(organizationGroup)
}
