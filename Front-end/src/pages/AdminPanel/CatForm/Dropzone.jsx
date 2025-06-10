export default function Dropzone({ type, preview, onChange, gallery=false }) {
    const cls = type==='rect' ? 'rect-drop' : 'square-preview';
    return (
      <label className={cls}>
        {preview
          ? <img src={preview} alt="preview"/>
          : <span className={type==='rect' ? 'hint' : 'square-hint'}>
              {gallery ? 'choose the file\nupload additional photos\n1 : 1' : 'photo'}
            </span>}
        {onChange && <input type="file" accept="image/*" hidden multiple={gallery} onChange={onChange}/>}
      </label>
    );
  }
  