import React from "react";

interface ToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onHeading: () => void;
  onBlockquote: () => void;
  onOrderedList: () => void;
  onUnorderedList: () => void;
  onLink: () => void;
  onImage: () => void;
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
      <button onClick={onImage} type="button">
        &#128247;
      </button>
    </div>
  );
};

export default Toolbar;
