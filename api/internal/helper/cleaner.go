package helper

import (
	"regexp"

	"github.com/google/uuid"
)

func CleanUUID(id string) (uuid.UUID, error) {
	re := regexp.MustCompile(`[^a-fA-F0-9-]`)
	id = re.ReplaceAllString(id, "")
	return uuid.Parse(id)
}
