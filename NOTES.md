# Notes

## Local development

`docker-compose.yml` was changed for my laptop (Mac): `platform: linux/amd64` was added so MySQL `8.0.25` and the backend image run on Apple Silicon (no arm64 manifests). Revert that change before treating the file as matching the original repository setup (or when reviewing on a native amd64 host).

## Followers count

README requires showing a followers count on Follow buttons. The Profile model in `docs/schema/swagger.json` does not define `followersCount`, and the API responses i use do not include it. Follow/unfollow and the followed/unfollowed button state are implemented but the numeric count is omitted.