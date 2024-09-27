package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FileGroup struct {
	ID string `gorm:"type:uuid;primary_key;"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	ExpiresAt time.Time `json:"expires_at"`

	Files []File `gorm:"foreignKey:GroupID"`

	Account   Account `json:"account" gorm:"foreignKey:AccountID"`
	AccountID string  `json:"user_id" gorm:"index"`
}

func (a *FileGroup) BeforeCreate(tx *gorm.DB) (err error) {
	if a.ID == "" {
		a.ID = uuid.New().String()
	}
	return
}
