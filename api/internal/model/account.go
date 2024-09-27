package model

import (
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Account struct {
	ID string `gorm:"type:uuid;primary_key;"`

	Credits int         `json:"credits" gorm:"default:0"`
	Plan    string      `json:"plan" gorm:"default:'free'"`
	Active  bool        `json:"active" gorm:"default:true"`
	UserID  uint        `json:"user_id" gorm:"index"`
	Group   []FileGroup `json:"group" gorm:"foreignKey:AccountID"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (a *Account) BeforeCreate(tx *gorm.DB) (err error) {
	if a.ID == "" {
		a.ID = uuid.New().String()
	}
	return
}

type Feature string

func (f *Feature) String() string {
	return string(*f)
}

const (
	GetAccount    Feature = "{accountId}"
	CompressImage Feature = "{accountId}:compress_image"
	ConvertImage  Feature = "{accountId}:convert_image"
	ResizeImage   Feature = "{accountId}:resize_image"
)

type Plan struct {
	Name  string
	Price int

	Features []Feature
}

var plans = map[string]Plan{
	"free": {
		Name:  "Free",
		Price: 0,
		Features: []Feature{
			GetAccount,
			ConvertImage,
		},
	},
	"basic": {
		Name:  "Basic",
		Price: 10,
		Features: []Feature{
			GetAccount,
			CompressImage,
			ConvertImage,
		},
	},
	"premium": {
		Name:  "Premium",
		Price: 50,
		Features: []Feature{
			GetAccount,
			CompressImage,
			ConvertImage,
			ResizeImage,
		},
	},
}

func GetPlan(name string) Plan {
	plan := plans[name]
	plan.Features = append(plan.Features, plan.Features...)
	return plan
}
func ReplacePlanAccountId(plan *Plan, accountId string) *Plan {
	features := make([]Feature, len(plan.Features))
	for i, feature := range plan.Features {
		features[i] = Feature(strings.ReplaceAll(feature.String(), "{accountId}", accountId))
	}
	plan.Features = features
	return plan
}
