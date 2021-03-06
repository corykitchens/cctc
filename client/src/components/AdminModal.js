import React from 'react';


const AdminModal = (props) => {
  return (
    <div className={[props.classNames, 'modal'].join(' ')}>
      <div className="modal-background"></div>
      <div className="modal-card has-text-centered">
        <header className="modal-card-head">
          <p className="modal-card-title">{props.title}</p>
          <button className="delete" aria-label="close"  onClick={props.disableModal}></button>
        </header>
        <section className="modal-card-body">
          <div className="content">
          {props.modalText}
          </div>
          <div className="content">
            {!props.timerStarted ? <button className="button is-link is-rounded submit-btn" onClick={props.beginTimer}>Start Timer</button> : null }
            {props.timerStarted ? <button className="button is-danger is-rounded submit-btn" onClick={props.pauseTimer}>Pause Timer</button> : null }
            <button className="button is-dark is-rounded submit-btn" onClick={props.disableModal}>Cancel</button>
          </div>
          <div className="contest">
            
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

export default AdminModal;