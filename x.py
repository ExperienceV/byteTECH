import os
import boto3
from botocore.exceptions import NoCredentialsError, ClientError
from pathlib import Path

# ====== CONFIGURACIÓN ======
R2_ACCESS_KEY_ID = "d5f882b44778a8df4f84b801f6388ca7"
R2_SECRET_ACCESS_KEY = "83d9693ca67ccd88ba700ec7278025abe3a8d84d5fc6554d0ef5eba97eefca83"
R2_ENDPOINT_URL = "https://90c4c499a423d9c9da52255a18f2d7a7.r2.cloudflarestorage.com"
R2_BUCKET_NAME = "bytetech"


# ====== CLIENTE ======
s3 = boto3.client(
    's3',
    endpoint_url=R2_ENDPOINT_URL,
    aws_access_key_id=R2_ACCESS_KEY_ID,
    aws_secret_access_key=R2_SECRET_ACCESS_KEY,
)

# ====== ELIMINAR TODO ======
print(f"🧹 Vaciando bucket '{R2_BUCKET_NAME}'...")

deleted = 0
continuation_token = None

while True:
    list_kwargs = {'Bucket': R2_BUCKET_NAME}
    if continuation_token:
        list_kwargs['ContinuationToken'] = continuation_token

    response = s3.list_objects_v2(**list_kwargs)

    if "Contents" not in response:
        print("✅ El bucket ya está vacío.")
        break

    for obj in response["Contents"]:
        s3.delete_object(Bucket=R2_BUCKET_NAME, Key=obj["Key"])
        deleted += 1
        print(f"🗑️  Borrado: {obj['Key']}")

    if response.get("IsTruncated"):
        continuation_token = response["NextContinuationToken"]
    else:
        break

print(f"✅ {deleted} objetos eliminados correctamente.")