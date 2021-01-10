# IPO.se backend

## Getting Started

1. Clone repo.
2. `cd` into the folder and run `yarn`.
3. `yarn dev` to run Strapi.
4. IPO backend available at http://localhost:1337

## Docker

Build and run image local:

`yarn docker:build`

`yarn docker:run`

---

## Deploy to production

This repo uses CD/CI through GitHub actions.

1. Push your code to `main` branch.
2. Docker image will be built and pushed to [Docker Hub](https://hub.docker.com/repository/docker/lundgren2/ipo-backend).
3. IPO K8s will automatically pull latest changes and deploy a new pod.

## Kubernetes

1.  Connect to kubernetes cluster.
2.  Set up k8s secrets by adding file `kubernetes/secrets.yaml`:

    ```yaml
    apiVersion: v1
    kind: Secret
    metadata:
      name: ipo-backend-secret
    type: Opaque
    stringData:
      DATABASE_HOST: ''
      DATABASE_NAME: ''
      DATABASE_USERNAME: ''
      DATABASE_PASSWORD: ''
      DATABASE_PORT: ''
    ```

3.  run `kubectl apply -f kuberetes/`
4.  Add `A record` for `api.ipo.se` to IP of `ipo-ingress`.
5.  Deployed with SSL certificate from Letsencrypt at:

    - URL: https://api.ipo.se
    - Admin Dashboard: https://api.ipo.se/admin

## Collections

- Users `/users`
- Posts `/posts`
- IPOs `/ipos`
- Podcasts `/podcasts`
- Podcast Episodes `/podcast-episodes`
- Tags `/tags`
- Categories `/categories`
