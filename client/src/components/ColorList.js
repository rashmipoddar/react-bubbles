import React, { useState } from "react";
import axiosWithAuth from "../utils/axiosWithAuth";

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  // console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [color, setColor] = useState({
    color: "",
    code: { hex: "" }
  })

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = e => {
    // Make a put request to save your updated color
    // think about where will you get the id from...
    // where is is saved right now?
    e.preventDefault();
    // console.log('the color is being edited', editing);
    // console.log('Color to edit ', colorToEdit);
    axiosWithAuth()
    .put(`/api/colors/${colorToEdit.id}`, colorToEdit)
      .then(response => {
        // console.log(response);
        const edittedColors = colors.map(color => {
          if (color.id === response.data.id) {
            return {
              ...color,
              color: response.data.color,
              code: response.data.code
            }
          } else {
            return color;
          }
        })
        updateColors(edittedColors);
        setEditing(false);
      })
      .catch(error => {
        console.log(error);
      })

  };

  const deleteColor = color => {
    // make a delete request to delete this color
    // console.log(color);
    axiosWithAuth()
    .delete(`/api/colors/${color.id}`)
    .then(response => {
      // console.log(response);
      const newColors = colors.filter(color => color.id !== response.data);
      updateColors(newColors);
    })
    .catch(error => {
      console.log(error);
    })
  };

  const addColor = event => {
    event.preventDefault();
    axiosWithAuth()
    .post('/api/colors', color)
      .then(response => {
        console.log(response);
        updateColors(response.data);
        setColor({color: '', code: {hex: ''}})
      })
      .catch(error => {
        console.log(error);
      })
  }

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span className="delete" onClick={() => deleteColor(color)}>
                x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      {/* <div className="spacer" /> */}
      {/* stretch - build another form here to add a color */}
        <form onSubmit={addColor}>
          <input
            type='text'
            name='color'
            placeholder='color'
            value={color.color}
            onChange={e => setColor({...color, color: e.target.value})} 
          />
          <input
            type='text'
            name='hexcode'
            placeholder='Hexcode'
            value={color.code.hex}
            onChange={ e => setColor({ ...color, code: { hex: e.target.value }})}
          />
          <button>Add Color</button>
        </form>        

    </div>
  );
};

export default ColorList;
