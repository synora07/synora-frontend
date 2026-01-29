import React from 'react';
import './PriceCompare.css';

const PriceCompare = ({ productName, prices }) => {
  const priceList = prices || [];
  
  if (priceList.length === 0) {
    return null;
  }

  const lowestPrice = Math.min(...priceList.map(p => p.price));

  return (
    <div className="price-compare">
      <div className="compare-header">
        <span className="compare-icon">💰</span>
        <span className="compare-title">PREIS-VERGLEICH</span>
      </div>

      <div className="compare-table">
        <div className="table-header">
          <span>Shop</span>
          <span>Preis</span>
          <span>Lieferung</span>
          <span>Hinweis</span>
        </div>

        {priceList.map((item, index) => (
          <div 
            key={index} 
            className={`table-row ${item.isRecommended ? 'recommended' : ''}`}
          >
            <span className="shop-col">
              {item.shop}
              {item.price === lowestPrice && (
                <span className="lowest-badge">Günstigster</span>
              )}
            </span>
            <span className="price-col">
              {item.currency} {item.price}
            </span>
            <span className="delivery-col">{item.delivery}</span>
            <span className="note-col">
              {item.warning && <span className="warning">⚠️ {item.warning}</span>}
              {item.note && !item.warning && <span className="note">💡 {item.note}</span>}
            </span>
          </div>
        ))}
      </div>

      <div className="compare-tip">
        <span>💡</span>
        <span><strong>TIPP:</strong> Der günstigste ist nicht immer der beste. Schau auch auf Lieferzeit und Vertrauen!</span>
      </div>

      <div className="neutral-note">
        <span>⚖️</span>
        <span>SYNORA ist NEUTRAL - Wir bevorzugen KEINEN Shop!</span>
      </div>
    </div>
  );
};

export default PriceCompare;
