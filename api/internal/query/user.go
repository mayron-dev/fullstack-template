package query

import (
	"github.com/mayron1806/go-api/config"
	"github.com/mayron1806/go-api/internal/model"
)

type QueryUser struct {
	*Query
}

func NewQueryUser() *QueryUser {
	db := config.GetDatabase()
	logger := config.GetLogger("Query User")
	return &QueryUser{Query: &Query{db: db, logger: logger}}
}
func (q *QueryUser) GetUserById(id uint) (*model.User, error) {
	user := model.User{}
	err := q.db.First(&user, id).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}
func (q *QueryUser) GetUserByEmail(email string) (*model.User, error) {
	user := model.User{}
	err := q.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}
