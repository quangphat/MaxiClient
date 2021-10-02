import * as React from 'react';
import * as PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import classnames from 'classnames';
import './index.css';
import { Loading } from '../Loading/Loading'

interface IFileUploadProps {
    className?: string,
    isDisabled?: boolean,
    acceptType?: string,
    isMultiple?: boolean,
    onSelectFile: Function,
    imageMaxSize?: number, // 1 MB
    imageMaxWidth?: number,
    imageMaxHeight?: number,
    onDrop?: Function
}
interface IFileUploadStates {
    dropzoneActive: boolean,
    isUploading: boolean
}

export class FileUpload extends React.Component<IFileUploadProps, IFileUploadStates> {
    constructor(props: any) {
        super(props);

        this.state = {
            dropzoneActive: false,
            isUploading: false
        }
    }

    static contextTypes = {
        ShowMessage: PropTypes.func
    }

    static defaultProps = {
        isDisabled: false,
        acceptType: 'image/*',
        isMultiple: false,
        imageMaxSize: 20
    }

    private handleOnDragEnter() {
        this.setState({ dropzoneActive: true });
    }

    private handleOnDragLeave() {
        this.setState({ dropzoneActive: false });
    }

    private handleOnDrop(acceptedFiles, rejectedFiles) {
        if (acceptedFiles && acceptedFiles.length > 0) {
            let listImage = [],
                error = false;

            acceptedFiles.map(item => {
                if (this.checkImageSize(item))
                    listImage.push(item)
                else
                    error = true
            })
            if (error) {
                this.context.ShowMessage('error', 'Dung lượng file vượt quá ' + this.props.imageMaxSize + ' MB. Vui lòng kiểm tra lại.');
                this.props.onSelectFile(null)
            }
            else {
                this.props.onSelectFile(listImage)
            }
        } else {
            this.context.ShowMessage('error', 'File không đúng định dạng cho phép. Vui lòng kiểm tra lại.');
        }
    }

    private checkImageResize(file) {
        if (file.type && (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/jpg'))
            if (this.props.imageMaxWidth && this.props.imageMaxHeight)
                return true

        return false
    }

    private checkImageSize(file) {
        if (file.type) {
            let size = file.size, maxSize = this.props.imageMaxSize * 1024 * 1024;
            if (maxSize >= size)
                return true
        }

        return false
    }

    public apiUploadFile(listFiles: any, productId: number, callback) {
        if (listFiles && listFiles.length > 0) {
            if (this.props.isMultiple) {
               
            } else {
                if (this.checkImageResize(listFiles[0])) {
                    this.resizeImage(listFiles[0], function (rsp) {
                        callback(rsp)
                    })
                } else {
                   
                }
            }
        } else {
            callback()
        }
    }

    private resizeImage(file, callback) {
        let reader = new FileReader();
        reader.onloadend = () => {
            let tempImg: any = new Image();
            tempImg.onload = () => {
                let maxWidth = this.props.imageMaxWidth || 1024;
                let maxHeight = this.props.imageMaxHeight || 1024;
                let tempWidth = tempImg.width;
                let tempHeight = tempImg.height;

                if (tempWidth > tempHeight) {
                    if (tempWidth > maxWidth) {
                        tempHeight *= maxWidth / tempWidth;
                        tempWidth = maxWidth;
                    }
                } else {
                    if (tempHeight > maxHeight) {
                        tempWidth *= maxHeight / tempHeight;
                        tempHeight = maxHeight;
                    }
                }

                let canvas = document.createElement('canvas');
                canvas.width = tempWidth;
                canvas.height = tempHeight;

                let context = canvas.getContext('2d');
                context.drawImage(tempImg, 0, 0, tempWidth, tempHeight);

                let dataUrl = canvas.toDataURL('image/jpeg');
                this.toBlob(dataUrl).then(blob => {
                   
                });
            }
            tempImg.src = reader.result;
        }
        reader.readAsDataURL(file);
    }

    private toBlob(dataURI: string): Promise<Blob> {
        return fetch(dataURI).then((res) => res.blob());
    }

    public render() {
        let { className, isDisabled, isMultiple, acceptType, children } = this.props,
            { dropzoneActive, isUploading } = this.state

        let classes = classnames({
            'file-upload': true,
            'disabled': isDisabled,
            [className]: className,
            'is-dragging': dropzoneActive
        })

        return (
            <div className={classes}>
                <Dropzone
                    className='file-upload-drop'
                    disabled={isDisabled}
                    accept={acceptType}
                    multiple={isMultiple}
                    onDragEnter={() => this.handleOnDragEnter()}
                    onDragLeave={() => this.handleOnDragLeave()}
                    onDrop={(acceptedFiles, rejectedFiles) => this.handleOnDrop(acceptedFiles, rejectedFiles)}>
                    {isUploading ? <Loading size='icon' />
                        : children
                    }
                </Dropzone>
            </div>
        );
    }
}