# FROM node:18.17.0-alpine AS build

# WORKDIR /app

# # 컨테이너에 package.json와 package-lock.json 파일을 복사
# COPY package*.json ./

# RUN npm ci

# COPY . .

# # Next.js를 빌드
# RUN npm run build

# # 새로운 단독의 nginx 이미지 생성
# FROM nginx

# # 오픈할 포트
# EXPOSE 80

# # default.conf을 /etc/nginx/conf.d/ 경로에 있는 default.conf에 복사
# COPY ./default.conf /etc/nginx/conf.d/default.conf

# # nextjs build한 결과물을 /usr/share/nginx/html에 복사
# COPY --from=build /app/.next  /usr/share/nginx/html

# COPY --from=build /app/public /usr/share/nginx/html

FROM node:18.17.0-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18.17.0-alpine

WORKDIR /app

COPY --from=build /app /app

RUN npm install --only=production

EXPOSE 3000

CMD ["npm", "start"]