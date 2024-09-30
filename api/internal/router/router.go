package router

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/mayron1806/go-api/config"
)

var (
	logger *config.Logger
)

func InitRouter() error {
	logger = config.GetLogger("Router")
	env := config.GetEnv()
	if env.ENV == "production" {
		gin.SetMode(gin.ReleaseMode)
	}
	router := gin.Default()

	logger.Info("registering routes...")
	registerRoutes(router)
	logger.Info("routes registered")

	logger.Info("starting server...")
	router.Run(fmt.Sprintf(":%s", env.PORT))
	return nil
}
