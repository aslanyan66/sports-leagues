# Stage 1: build the static site.
FROM node:22-alpine AS build
WORKDIR /app
# Corepack installs the pnpm version pinned in package.json ("packageManager").
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Stage 2: serve dist/ with nginx. Only the built files end up in the final image.
FROM nginx:1.28-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
