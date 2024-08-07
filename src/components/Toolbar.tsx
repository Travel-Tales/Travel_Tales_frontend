import React, { useRef } from "react";

interface ToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onHeading: () => void;
  onBlockquote: () => void;
  onOrderedList: () => void;
  onUnorderedList: () => void;
  onLink: () => void;
  onImage: (e: any) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onBold,
  onItalic,
  onHeading,
  onBlockquote,
  onOrderedList,
  onUnorderedList,
  onLink,
  onImage,
}) => {
  const imageRef = useRef(null);

  return (
    <div className="toolbar">
      <button onClick={onBold} type="button">
        <strong>B</strong>
      </button>
      <button onClick={onItalic} type="button">
        <em>I</em>
      </button>
      <button onClick={onHeading} type="button">
        H
      </button>
      <button onClick={onBlockquote} type="button">
        &ldquo;
      </button>
      <button onClick={onOrderedList} type="button">
        1.
      </button>
      <button onClick={onUnorderedList} type="button">
        -
      </button>
      <button onClick={onLink} type="button">
        &#128279;
      </button>
      <label className="relative cursor-pointer">
        &#128247;
        <input
          id="file_upload"
          onChange={onImage}
          ref={imageRef}
          type="file"
          alt="profile-image"
          aria-label="이미지 업로드"
          accept="image/*"
          required
          className="absolute top-0 left-0 h-0 invisible"
        />
      </label>
    </div>
  );
};

export default Toolbar;
