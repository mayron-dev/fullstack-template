package model

type Feature struct {
	Name       string
	Expression string
	Active     bool

	Plans []Plan `json:"plans" gorm:"many2many:plan_feature;"`
}

func (f Feature) String() string {
	return string(f.Expression)
}
