import * as React from 'react';

interface IBoolMarkProps {

}

interface IBoolMarkStates {

}

export class BoolMark extends React.Component<IBoolMarkProps, IBoolMarkStates> {
    constructor(props: any) {
        super(props)
       
        this.state = {
            

        }


    }


    static defaultProps = {
        className: ''
    }

    componentWillReceiveProps(newProps: IBoolMarkProps) {

    }


    bookmarkItem = (evt) => {
        if (evt.target.classList.contains('checked')) {
          evt.target.classList.remove('checked', 'fas');
          evt.target.classList.add('far');
        } else {
          evt.target.classList.remove('far');
          evt.target.classList.add('checked', 'fas');
        }
      }
    private renderBody() {
        return <div className="bookmark-item">
            <i className="far fa-bookmark" 
        onClick={(evt) => this.bookmarkItem(evt)}></i>
        </div>
    }


    public render() {
        return this.renderBody()

    }
}