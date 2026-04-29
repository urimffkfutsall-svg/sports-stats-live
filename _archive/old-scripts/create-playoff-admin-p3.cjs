const fs = require("fs");

const p3 = `
      {/* ====== DISPLAY SERIES BY ROUND ====== */}
      {playoffType === 'superliga' ? (
        <>
          {/* Quarter Finals */}
          {quarterSeries.length > 0 && (
            <div>
              <h3 className="font-black text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-orange-500 rounded-full"></span>Cerekfinale
                <span className="text-xs text-gray-400 font-normal">(Vendi 3 vs 6, Vendi 4 vs 5) - Dy fitore per te kaluar</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quarterSeries.map(s => renderSeriesCard(s))}
              </div>
            </div>
          )}

          {/* Semi Finals */}
          {semiSeries.length > 0 && (
            <div>
              <h3 className="font-black text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-blue-500 rounded-full"></span>Gjysmefinale
                <span className="text-xs text-gray-400 font-normal">(Vendi 1 & 2 presin fituesit e cerekfinaleve)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {semiSeries.map(s => renderSeriesCard(s))}
              </div>
            </div>
          )}

          {/* Final */}
          {finalSeries.length > 0 && (
            <div>
              <h3 className="font-black text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#d0a650] rounded-full"></span>Finalja
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {finalSeries.map(s => renderSeriesCard(s))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Liga e Pare - Barrage */}
          {currentSeries.length > 0 && (
            <div>
              <h3 className="font-black text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-red-500 rounded-full"></span>PlayOff Liga e Pare
                <span className="text-xs text-gray-400 font-normal">(Vendi 8 i Superliges vs Vendi 3 i Liges se Pare)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentSeries.map(s => renderSeriesCard(s))}
              </div>
            </div>
          )}
        </>
      )}

      {currentSeries.length === 0 && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center py-14">
          <p className="text-gray-400 text-sm">Nuk ka seri te shtuara per {playoffType === 'superliga' ? 'PlayOff Superliga' : 'PlayOff Liga e Pare'}</p>
        </div>
      )}
    </div>
  );
};

export default AdminPlayoff;
`;

fs.appendFileSync("src/pages/admin/AdminPlayoff.tsx", p3, "utf8");
console.log("[OK] Part 3 - Series display + closing");

// Verify
const final = fs.readFileSync("src/pages/admin/AdminPlayoff.tsx", "utf8");
console.log("Total lines: " + final.split("\n").length);
console.log("Has export: " + final.includes("export default AdminPlayoff"));
console.log("Has renderSeriesCard: " + final.includes("renderSeriesCard"));
