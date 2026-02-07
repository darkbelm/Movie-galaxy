export default function Loading() {
  return (
    <div>
      {[1, 2, 3, 4].map((row) => (
        <div className="mb-5" key={row}>
          <div className="placeholder-glow mb-3">
            <span className="placeholder col-4"></span>
          </div>

          <div className="row g-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div className="col-6 col-md-3 col-lg-2" key={i}>
                <div className="card">
                  <div
                    className="placeholder-glow"
                    style={{ height: "270px" }}
                  >
                    <div className="placeholder w-100 h-100"></div>
                  </div>
                  <div className="card-body p-2">
                    <span className="placeholder col-8"></span>
                    <span className="placeholder col-5"></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
