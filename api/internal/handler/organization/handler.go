package organization

import (
	"github.com/gin-gonic/gin"
	"github.com/mayron1806/go-api/config"
	"github.com/mayron1806/go-api/internal/handler"
	"gorm.io/gorm"
)

type OrganizationHandler struct {
	*handler.Handler
	db *gorm.DB
}

func NewOrganizationHandler() *OrganizationHandler {
	logger := config.GetLogger("Organization Handler")
	db := config.GetDatabase()

	handler := &OrganizationHandler{
		Handler: handler.NewHandler(logger),
		db:      db,
	}
	return handler
}
func (a *OrganizationHandler) Register(rg *gin.RouterGroup) {
	rg.GET("/all", a.GetOrganizations)
}
