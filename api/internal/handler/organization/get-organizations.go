package organization

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mayron1806/go-api/internal/model"
)

type GetOrganizationsResponse struct {
	Organizations []struct {
		ID       string `json:"id"`
		PlanCode string `json:"planCode"`
		Active   bool   `json:"active"`
	} `json:"organizations"`
}

func (h *OrganizationHandler) GetOrganizations(c *gin.Context) {
	claims := h.GetClaims(c)
	userId := claims.Data.UserID

	var organizations []model.Organization
	err := h.db.Where("members.user_id = ? AND members.active = ? AND active = ?", userId, true, true).Preload("Members").Find(&organizations).Error
	if err != nil {
		h.ResponseError(c, http.StatusBadRequest, "error finding organizations: %s", err.Error())
		return
	}
	var response GetOrganizationsResponse
	for _, org := range organizations {
		response.Organizations = append(response.Organizations, struct {
			ID       string `json:"id"`
			PlanCode string `json:"planCode"`
			Active   bool   `json:"active"`
		}{
			ID:       org.ID,
			PlanCode: org.PlanCode,
			Active:   org.Active,
		})
	}
	c.JSON(http.StatusOK, response)
}
