import env from '#start/env'

const storageConfig = {
  minio: {
    endpoint: env.get('MINIO_ENDPOINT'),
    region: env.get('MINIO_REGION', 'us-east-1'),

    accessKeyId: env.get('MINIO_ACCESS_KEY'),
    secretAccessKey: env.get('MINIO_SECRET_KEY'),

    bucket: env.get('MINIO_BUCKET', 'cashmanagement'),

    useSSL: env.get('MINIO_USE_SSL', 'false') === 'true',
  },
}

export default storageConfig
