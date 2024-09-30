package plan

import "github.com/mayron1806/go-api/internal/model"

func Features() map[string]model.Feature {
	return map[string]model.Feature{
		"edit": {
			Name:       "Editar configurações",
			Expression: "{organization-id}:edit",
			Active:     true,
		},
		"update-plan": {
			Name:       "Alterar plano",
			Expression: "{organization-id}:update-plan",
			Active:     true,
		},
		"payed": {
			Name:       "Funcionalidade pago",
			Expression: "{organization-id}:payed",
			Active:     true,
		},
	}
}
func Plans() map[string]model.Plan {
	return map[string]model.Plan{
		"free": {
			Code:      "free",
			Name:      "Gratuito",
			Active:    true,
			Price:     0,
			IsDefault: true,
			Features: []model.Feature{
				Features()["edit"],
				Features()["update-plan"],
			},
		},
		"pro": {
			Code:      "pro",
			Name:      "Pro",
			Active:    true,
			Price:     100,
			IsDefault: false,
			Features: []model.Feature{
				Features()["edit"],
				Features()["update-plan"],
				Features()["payed"],
			},
		},
	}
}

func DefaultPlan() model.Plan {
	return Plans()["free"]
}
