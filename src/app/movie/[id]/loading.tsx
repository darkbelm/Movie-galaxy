export default function LoadingMovie() {
  return (
    <div className="row">
      <div className="col-md-4 mb-3">
        <div
          className="placeholder-glow rounded"
          style={{ height: "450px", background: "#2b2b3c" }}
        >
          <div className="placeholder w-100 h-100 rounded"></div>
        </div>
      </div>

      <div className="col-md-8">
        <div className="placeholder-glow mb-2">
          <span className="placeholder col-6"></span>
        </div>

        <div className="placeholder-glow mb-2">
          <span className="placeholder col-3"></span>
        </div>

        <div className="placeholder-glow mb-3">
          <span className="placeholder col-10"></span>
          <span className="placeholder col-8"></span>
          <span className="placeholder col-9"></span>
        </div>

        <div className="mt-4 p-3 rounded border border-secondary">
          <div className="placeholder-glow mb-2">
            <span className="placeholder col-4"></span>
          </div>

          <div className="d-flex gap-2 mb-2">
            <span className="placeholder col-2"></span>
            <span className="placeholder col-2"></span>
            <span className="placeholder col-2"></span>
          </div>

          <span className="placeholder col-3"></span>
        </div>

        <div className="d-flex gap-2 mt-3">
          <span className="placeholder col-2"></span>
          <span className="placeholder col-2"></span>
        </div>
      </div>
    </div>
  );
}
