import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../components/Spinner';

const API = 'https://api.coingecko.com/api/v3';

function CoinDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coin, setCoin] = useState(null);
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [coinRes, chartRes] = await Promise.all([
          fetch(`${API}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`),
          fetch(`${API}/coins/${id}/market_chart?vs_currency=usd&days=7`)
        ]);
        if (!coinRes.ok || !chartRes.ok) throw new Error('Failed to fetch coin');

        const coinData = await coinRes.json();
        const chartData = await chartRes.json();
        if (cancelled) return;

        setCoin(coinData);
        setPrices(chartData.prices || []);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  // Helpers for formatting
  const fmtCurrency = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n ?? 0);
  const fmtCompact = (n) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n ?? 0);

  // Build path and axes for a 7d simple SVG chart
  const chart = useMemo(() => {
    if (!prices.length) return { path: '', width: 0, height: 0, xTicks: [], yTicks: [], mapX: () => 0, mapY: () => 0 };

    const width = 640; // outer
    const height = 240; // outer
    const margin = { top: 12, right: 16, bottom: 28, left: 56 };
    const iw = width - margin.left - margin.right;
    const ih = height - margin.top - margin.bottom;

    const xs = prices.map(p => p[0]);
    const ys = prices.map(p => p[1]);
    const xMin = xs[0];
    const xMax = xs[xs.length - 1];
    const yMin = Math.min(...ys);
    const yMax = Math.max(...ys);

    const mapX = (t) => margin.left + ((t - xMin) / (xMax - xMin || 1)) * iw;
    const mapY = (v) => margin.top + (ih - ((v - yMin) / (yMax - yMin || 1)) * ih);

    const path = prices.map(([t, v], i) => `${i === 0 ? 'M' : 'L'} ${mapX(t)} ${mapY(v)}`).join(' ');

    // X ticks: start, mid, end (dates)
    const midT = xMin + (xMax - xMin) / 2;
    const xTicks = [xMin, midT, xMax].map(t => ({ t, x: mapX(t), label: new Date(t).toLocaleDateString() }));

    // Y ticks: min, mid, max (prices)
    const midV = yMin + (yMax - yMin) / 2;
    const yTicks = [yMin, midV, yMax].map(v => ({ v, y: mapY(v), label: fmtCurrency(v) }));

    return { path, width, height, margin, xTicks, yTicks, mapX, mapY };
  }, [prices]);

  if (loading) return <Spinner />;
  if (error) return <div className="about"><p>Error: {error}</p><Link to="/">⬅ Back</Link></div>;
  if (!coin) return null;

  return (
    <div className="about">
      <Link to="/">⬅ Back</Link>
      <h1 style={{display:'flex', alignItems:'center', gap:12}}>
        {coin.image?.thumb && <img src={coin.image.thumb} alt={coin.name} style={{width:28, height:28, borderRadius:6}} />}
        {coin.name} <span style={{color:'#666', fontSize:18}}>({coin.symbol?.toUpperCase?.()})</span>
      </h1>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:12, margin:'12px 0 18px'}}>
        <div className='coin-price' style={{margin:0}}>
          <div>
            <div className='stat-label'>Current price</div>
            <div className='price' style={{fontSize:'1.25rem'}}>{fmtCurrency(coin.market_data?.current_price?.usd)}</div>
          </div>
        </div>
        <div className='coin-price' style={{margin:0}}>
          <div>
            <div className='stat-label'>Market cap</div>
            <div className='price' style={{fontSize:'1.25rem'}}>{fmtCompact(coin.market_data?.market_cap?.usd)}</div>
          </div>
        </div>
        <div className='coin-price' style={{margin:0}}>
          <div>
            <div className='stat-label'>Rank</div>
            <div className='price' style={{fontSize:'1.25rem'}}>#{coin.market_cap_rank || 'N/A'}</div>
          </div>
        </div>
      </div>

      <h3 style={{margin:'10px 0'}}>7d Price</h3>
      <div style={{overflow:'auto'}}>
        <svg width={chart.width} height={chart.height} style={{background:'#0e1117', borderRadius:8}}>
          {/* Axes */}
          {/* Y axis line */}
          <line x1={56} y1={12} x2={56} y2={chart.height-28} stroke="#2d3339" />
          {/* X axis line */}
          <line x1={56} y1={chart.height-28} x2={chart.width-16} y2={chart.height-28} stroke="#2d3339" />

          {/* Y ticks and labels */}
          {chart.yTicks.map((t, i) => (
            <g key={i}>
              <line x1={52} x2={chart.width-16} y1={t.y} y2={t.y} stroke="#222" />
              <text x={8} y={t.y+4} fill="#aaa" fontSize="10">{t.label}</text>
            </g>
          ))}

          {/* X ticks and labels */}
          {chart.xTicks.map((t, i) => (
            <g key={i}>
              <line x1={t.x} x2={t.x} y1={chart.height-28} y2={chart.height-24} stroke="#2d3339" />
              <text x={t.x} y={chart.height-8} fill="#aaa" fontSize="10" textAnchor="middle">{t.label}</text>
            </g>
          ))}

          {/* Line path */}
          <path d={chart.path} fill="none" stroke="#58a6ff" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}

export default CoinDetails;
