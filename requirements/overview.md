
# 女優評価システム仕様概要

## システム概要
このシステムは、女優の評価と順位付けを行うためのWebアプリケーションです。ユーザーは女優に対して評価を投稿し、その評価データを基に総合的なランキングを提供します。

## 主要機能

### 1. ユーザー管理
- ユーザー登録機能
  - ユーザー名とパスワードによる登録
  - ユーザー名の重複チェック
- ログイン/ログアウト機能
  - セッションベースの認証
  - Protected Routeによるアクセス制御

### 2. 女優情報管理
- 女優プロフィール表示
  - 名前、説明文の表示
  - 評価の集計結果表示
- 女優一覧表示
  - 検索機能付きリスト表示
  - 評価の平均値表示

### 3. 評価システム
評価は以下の3つの観点から10点満点で行われます：
- ルックス（Looks）：0-10点
- セクシー（Sexy）：0-10点
- エレガント（Elegant）：0-10点

各評価にはコメントを付けることが可能です。

### 4. プロフィール機能
- ユーザープロフィールページ
  - 評価した女優の一覧表示
  - トップ5の評価した女優表示（平均評価順）
- 評価履歴の表示
  - 各評価のコメントと評点を表示

## データベース設計

### テーブル構成
1. users（ユーザー情報）
   - id: シリアル（主キー）
   - username: テキスト（一意）
   - password: テキスト（ハッシュ化）
   - created_at: タイムスタンプ

2. actresses（女優情報）
   - id: シリアル（主キー）
   - name: テキスト
   - description: テキスト
   - created_at: タイムスタンプ

3. evaluations（評価情報）
   - id: シリアル（主キー）
   - user_id: 整数（外部キー：users）
   - actress_id: 整数（外部キー：actresses）
   - looks_rating: 小数点（精度3、スケール1）
   - sexy_rating: 小数点（精度3、スケール1）
   - elegant_rating: 小数点（精度3、スケール1）
   - comment: テキスト
   - created_at: タイムスタンプ
   - updated_at: タイムスタンプ

## 技術スタック
- フロントエンド
  - React + TypeScript
  - TanStack Query（データフェッチング）
  - Tailwind CSS + shadcn/ui（UIコンポーネント）
  - Wouter（ルーティング）
  - Zod（バリデーション）
  
- バックエンド
  - Node.js + Express
  - Drizzle ORM
  - PostgreSQL（Neon）
  - Passport.js（認証）
  - express-session（セッション管理）

## 主要API
- GET /api/actresses - 女優一覧の取得
- GET /api/actresses/:id - 特定の女優の詳細取得
- POST /api/actresses/:id/evaluate - 評価の投稿
- GET /api/users/:username - ユーザープロフィールの取得
- GET /api/user - 現在のログインユーザー情報の取得

## セキュリティ
- パスワードのハッシュ化
- セッションベースの認証
- Protected Routesによるアクセス制御
- CSRFトークンの使用

## 今後の課題
- 評価の編集・削除機能
- 管理者機能の実装
- ソート機能の追加
- パフォーマンス最適化
