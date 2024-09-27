package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FileType string

const (
	FileTypeImage FileType = "image"
)

type File struct {
	ID string `gorm:"type:uuid;primary_key;"`

	OriginalName string      `json:"original_name"`
	Path         string      `json:"path" gorm:"index"`
	Type         FileType    `json:"type"`
	ContentType  string      `json:"content_type"`
	Operations   interface{} `json:"operations" gorm:"serializer:json"`

	Group   *FileGroup
	GroupID *string `json:"group_id" gorm:"index"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	ExpiresAt time.Time `json:"expires_at"`
}

func (a *File) BeforeCreate(tx *gorm.DB) (err error) {
	if a.ID == "" {
		a.ID = uuid.New().String()
	}
	return
}
