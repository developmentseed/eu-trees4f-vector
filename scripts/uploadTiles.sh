gsutil -o GSUtil:parallel_process_count=1 -m  cp -r ./data/hex/tiles gs://eu-trees4f-tiles/hex/
gsutil -o GSUtil:parallel_process_count=1 -m  cp -r ./data/points/tiles gs://eu-trees4f-tiles/points
gsutil cors set ./scripts/CORS.json gs://eu-trees4f-tiles
gsutil -o GSUtil:parallel_process_count=1 -m setmeta -r -h "Content-Encoding:gzip" gs://eu-trees4f-tiles/hex/
gsutil -o GSUtil:parallel_process_count=1 -m setmeta -r -h "Content-Encoding:gzip" gs://eu-trees4f-tiles/points/