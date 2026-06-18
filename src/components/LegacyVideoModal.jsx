export default function LegacyVideoModal() {
  return (
    <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-body">
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
              <svg className="bi" width="40" height="40">
                <use xlinkHref="#close-sharp" />
              </svg>
            </button>
            <div className="ratio ratio-16x9">
              <video className="embed-responsive-item" id="video" controls playsInline preload="metadata" poster="/images/product-item3.avif">
                <source id="videoSource" src="" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
