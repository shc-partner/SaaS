CREATE TABLE IF NOT EXISTS youtube_trend_category (
  idx INT AUTO_INCREMENT PRIMARY KEY,
  category_id VARCHAR(10) NOT NULL,
  category_name VARCHAR(100) NOT NULL,
  api_name VARCHAR(100) DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  reg_date DATETIME NOT NULL,
  UNIQUE KEY uniq_youtube_trend_category_id (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS workspace_youtube_trend_category (
  idx INT AUTO_INCREMENT PRIMARY KEY,
  workspace_id VARCHAR(64) NOT NULL,
  category_id VARCHAR(10) NOT NULL,
  is_enabled TINYINT(1) NOT NULL DEFAULT 1,
  reg_date DATETIME NOT NULL,
  mod_date DATETIME DEFAULT NULL,
  UNIQUE KEY uniq_workspace_youtube_trend_category (workspace_id, category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO youtube_trend_category
  (category_id, category_name, api_name, sort_order, is_default, reg_date)
VALUES
  ('1',  '영화·애니',       'Film & Animation',       10, 1, NOW()),
  ('2',  '자동차',          'Autos & Vehicles',       20, 1, NOW()),
  ('10', '음악',            'Music',                  30, 1, NOW()),
  ('15', '동물',            'Pets & Animals',         40, 1, NOW()),
  ('17', '스포츠',          'Sports',                 50, 1, NOW()),
  ('19', '여행·이벤트',     'Travel & Events',        60, 1, NOW()),
  ('20', '게임',            'Gaming',                 70, 1, NOW()),
  ('22', '인물·브이로그',   'People & Blogs',         80, 1, NOW()),
  ('23', '코미디',          'Comedy',                 90, 1, NOW()),
  ('24', '엔터테인먼트',    'Entertainment',         100, 1, NOW()),
  ('25', '뉴스·정치',       'News & Politics',       110, 1, NOW()),
  ('26', '노하우·스타일',   'Howto & Style',         120, 1, NOW()),
  ('27', '교육',            'Education',             130, 1, NOW()),
  ('28', '과학·기술',       'Science & Technology',  140, 1, NOW()),
  ('29', '비영리·사회운동', 'Nonprofits & Activism', 150, 0, NOW()),
  ('18', '단편 영화',       'Short Movies',          160, 0, NOW()),
  ('21', '비디오 블로그',   'Videoblogging',         170, 0, NOW()),
  ('30', '영화',            'Movies',                180, 0, NOW()),
  ('31', '애니메이션',      'Anime/Animation',       190, 0, NOW()),
  ('32', '액션·어드벤처',   'Action/Adventure',      200, 0, NOW()),
  ('33', '클래식',          'Classics',              210, 0, NOW()),
  ('34', '코미디 영화',     'Comedy',                220, 0, NOW()),
  ('35', '다큐멘터리',      'Documentary',           230, 0, NOW()),
  ('36', '드라마',          'Drama',                 240, 0, NOW()),
  ('37', '가족',            'Family',                250, 0, NOW()),
  ('38', '해외',            'Foreign',               260, 0, NOW()),
  ('39', '공포',            'Horror',                270, 0, NOW()),
  ('40', 'SF·판타지',       'Sci-Fi/Fantasy',        280, 0, NOW()),
  ('41', '스릴러',          'Thriller',              290, 0, NOW()),
  ('42', '숏츠',            'Shorts',                300, 0, NOW()),
  ('43', '쇼',              'Shows',                 310, 0, NOW()),
  ('44', '예고편',          'Trailers',              320, 0, NOW());
