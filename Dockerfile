FROM node:22.13.1-alpine3.21 AS builder

WORKDIR /app

# 依存関係インストール（devDependenciesも含む。tscが必要なため）
COPY package*.json ./
RUN npm ci

# ソース全体をコピーしてビルド
COPY . .
RUN npm run build
# → 通常 ./dist に出力される想定（tsconfig.jsonのoutDir次第）


# ===== Stage 2: 実行用（軽量） =====
FROM node:22-alpine AS runner

WORKDIR /app

# 本番用依存のみインストール
COPY package*.json ./
RUN npm ci --omit=dev

# ビルド成果物だけをStage 1からコピー
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/entry.js"]