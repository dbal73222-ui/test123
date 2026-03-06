const express = require('express');
const axios   = require('axios');
const app     = express();

// ── CORS 헤더 설정 ─────────────────────────────────────────────────────────
// 브라우저의 CORS 차단을 해제 — 모든 출처에서 이 서버에 요청 가능
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ── 헬스체크 ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: '런트래커 프록시 서버 실행 중' });
});

// ── 이벤트 정보 조회 ──────────────────────────────────────────────────────
// GET /api/event/:eventId
// 예: /api/event/141
app.get('/api/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const response = await axios.get(
      `https://www.myresult.co.kr/api/event/${eventId}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );
    res.json(response.data);
  } catch (err) {
    console.error('이벤트 조회 실패:', err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// ── 배번으로 선수 검색 ────────────────────────────────────────────────────
// GET /api/event/:eventId/player?q=배번
// 예: /api/event/141/player?q=1001
app.get('/api/event/:eventId/player', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { q } = req.query;

    if (!q) return res.status(400).json({ error: '배번(q)을 입력해주세요' });

    const response = await axios.get(
      `https://www.myresult.co.kr/api/event/${eventId}/player?q=${q}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );
    res.json(response.data);
  } catch (err) {
    console.error('선수 검색 실패:', err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// ── 선수 상세 + records 조회 ──────────────────────────────────────────────
// GET /api/event/:eventId/player/:num
// 예: /api/event/141/player/1001
app.get('/api/event/:eventId/player/:num', async (req, res) => {
  try {
    const { eventId, num } = req.params;
    const response = await axios.get(
      `https://www.myresult.co.kr/api/event/${eventId}/player/${num}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );
    res.json(response.data);
  } catch (err) {
    console.error('선수 상세 조회 실패:', err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// ── 서버 시작 ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ 런트래커 프록시 서버 실행 중 — port ${PORT}`);
});
