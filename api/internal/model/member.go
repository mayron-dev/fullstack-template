package model

import "time"

type Member struct {
	UserID         uint         `json:"user_id" gorm:"primaryKey;index"`
	OrganizationID string       `json:"organization_id" gorm:"primaryKey;index"`
	Organization   Organization `json:"organization" gorm:"foreignKey:OrganizationID"`
	Active         bool         `json:"active" gorm:"default:true"`
	Owner          bool         `json:"owner" gorm:"default:false"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
