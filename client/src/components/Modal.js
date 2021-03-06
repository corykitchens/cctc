import React from 'react';


const Modal = (props) => {
  return (
    <div className={[props.classNames, 'modal'].join(' ')}>
      <div className="modal-background"></div>
      <div className="modal-card has-text-centered">
        <header className="modal-card-head">
          <p className="modal-card-title">Password Attempt</p>
          <button className="delete" aria-label="close"  onClick={props.disableModal}></button>
        </header>
        <section className="modal-card-body">
          <div className="content">
          {props.modalText}
          </div>
          <div className="content">
            <button className="button is-info is-rounded submit-btn" onClick={props.disableModal}>Close</button>
          </div>
          
        </section>
        <footer className="modal-card-foot content has-text-centered">
          <div className="content has-text-centered">
            
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Modal;