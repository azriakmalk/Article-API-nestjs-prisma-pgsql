-- CreateTable
CREATE TABLE "user" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_auth" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "refresh_token" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "jti" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(0),
    "device_info" VARCHAR(255),
    "ip_address" VARCHAR(255),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "user_auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role" (
    "user_id" BIGINT NOT NULL,
    "role_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "article" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_like" (
    "user_id" BIGINT NOT NULL,
    "article_id" BIGINT NOT NULL,
    "isLiked" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "article_like_pkey" PRIMARY KEY ("user_id","article_id")
);

-- CreateIndex
CREATE INDEX "user_auth_user_id_jti_refresh_token_idx" ON "user_auth"("user_id", "jti", "refresh_token");

-- CreateIndex
CREATE INDEX "article_like_user_id_article_id_idx" ON "article_like"("user_id", "article_id");

-- AddForeignKey
ALTER TABLE "user_auth" ADD CONSTRAINT "user_auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_like" ADD CONSTRAINT "article_like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_like" ADD CONSTRAINT "article_like_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
