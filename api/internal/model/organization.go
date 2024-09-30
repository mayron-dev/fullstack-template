package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Organization struct {
	ID string `json:"id" gorm:"primary_key;type:uuid;"`

	Active   bool   `json:"active" gorm:"default:true"`
	PlanCode string `json:"plan_code"`

	Members []Member `json:"members" gorm:"foreignKey:OrganizationID"`
}

func (b *Organization) BeforeCreate(tx *gorm.DB) (err error) {
	if b.ID == "" {
		b.ID = uuid.New().String()
	}
	return
}
