interface ImageModalProps {
  image: string | null;
  onClose: () => void;
}

export function ImageModal({ image, onClose }: ImageModalProps) {
  return (
    <div
      className={`modal-overlay ${image ? 'active' : ''}`}
      id="image-modal"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <span className="close-modal" onClick={onClose}>
        ×
      </span>
      {image ? <img alt="Полноразмерное изображение задания" className="modal-image" id="modal-image" src={image} /> : null}
    </div>
  );
}
