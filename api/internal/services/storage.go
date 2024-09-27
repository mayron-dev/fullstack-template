package services

import (
	"bytes"
	"fmt"
	"mime/multipart"
	"net/http"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/mayron1806/go-api/config"
)

type StorageService struct {
	logger   *config.Logger
	uploader *s3manager.Uploader
	bucket   string
}

func NewStorageService(bucket string) (*StorageService, error) {
	env := config.GetEnv()
	logger := config.GetLogger("Storage Service")
	sess, err := session.NewSession(&aws.Config{
		Endpoint: aws.String(env.R2_ENDPOINT),
		Credentials: credentials.NewStaticCredentials(
			env.R2_ACCESS_KEY_ID,
			env.R2_SECRET_ACCESS_KEY,
			"",
		),
		Region: aws.String(env.R2_REGION),
	})
	if err != nil {
		return nil, err
	}
	return &StorageService{
		uploader: s3manager.NewUploader(sess),
		bucket:   bucket,
		logger:   logger,
	}, nil
}

func (s *StorageService) UploadFile(file multipart.File, path string) (string, error) {
	buffer := make([]byte, 512)
	_, err := file.Read(buffer)
	if err != nil {
		return "", err
	}
	fileType := http.DetectContentType(buffer)

	_, err = file.Seek(0, 0)
	if err != nil {
		return "", err
	}

	result, err := s.uploader.Upload(&s3manager.UploadInput{
		Bucket:      aws.String(s.bucket),
		Key:         aws.String(path),
		Body:        bytes.NewReader(buffer),
		ContentType: aws.String(fileType),
		ACL:         aws.String("public-read"),
	})

	if err != nil {
		return "", fmt.Errorf("failed to upload file to s3: %v", err)
	}
	return result.Location, nil
}
