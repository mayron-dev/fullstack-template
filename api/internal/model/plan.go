package model

type Plan struct {
	Code      string `json:"code" gorm:"uniqueIndex"`
	Name      string `json:"name"`
	Active    bool   `json:"active"`
	Price     int    `json:"price"`
	IsDefault bool   `json:"is_default"`

	Features      []Feature      `json:"features" gorm:"many2many:plan_feature;"`
	Organizations []Organization `json:"organizations"`
}
