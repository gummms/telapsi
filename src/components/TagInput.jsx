import Icones from "./Icones";
import "./Buttons.css";

// We accept 'options' and 'label' as props now.
// If they are not provided, we fall back to the defaults (for backward compatibility).
const TagInput = ({ tags, setTags, options, label = "Palavras-chave" }) => {
  const defaultTags = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  // Use the passed options, or fallback to defaultTags if options is undefined
  const tagsToDisplay = options || defaultTags;

  const handleTagChange = (e) => {
    const selectedTag = e.target.value;
    if (selectedTag && !tags.includes(selectedTag)) {
      setTags([...tags, selectedTag]);
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <>
      {/* Use the dynamic label */}
      <label id="label-input">{label}</label>
      <select
        id="select-input"
        value=""
        onChange={handleTagChange}
        className={tags.length === 0 ? "select-placeholder" : ""}
      >
        <option value="" disabled hidden>
          Selecione uma opção
        </option>
        {tagsToDisplay
          .filter((tag) => !tags.includes(tag))
          .map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
      </select>
      {tags.length > 0 && (
        <div className="tags-display">
          {tags.map((tag) => (
            <div key={tag} className="tag-item">
              {tag}
              <button onClick={() => removeTag(tag)} className="remove-tag-btn">
                <i>
                  <Icones icone="fa-x" />
                </i>
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TagInput;
