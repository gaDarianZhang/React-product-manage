import React, { Component } from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {BASE_URL} from '../../../config/config'
import {reqDeletePicture} from '../../../request/requests'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    // console.log(file);

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = (values) => {
    const {fileList,file} = values;
    if (file.status==="done"&&file.response.status===0) {
      /* 
        直接把给file添加url属性的话不能被维护到fileList中，
        因此要维护fileList内的新增file，给其添加url属性。
      */
      // file.url = file.response.data.url;
      message.success("图片上传成功",1);
      fileList[fileList.length-1].url = file.response.data.url;
      fileList[fileList.length-1].name = file.response.data.name;

    }else if (file.status==="error") {
      message.error("图片上传失败！",1);
    }
    // else if (file.status==='removed') {
    //   console.log("文件已删除");
    // }//用这种办法也能检测到文件删除，onRemove也能监测到文件删除
    this.setState({ fileList });
  }
  //删除图片的回调，但是也可以放在onChange的回调中，通过判断是否为“removed”
  handleRemove= async(file)=>{
    let result = await reqDeletePicture(file.name);
    const {status,msg} = result;
    if (status===0) {
      message.success("图片删除成功",1);
    }else{
      message.error(msg?msg:"图片删除失败",1);
    }
  }
  getPicturesName=()=>{
    let picturesList = [];
    this.state.fileList.forEach(item=>picturesList.push(item.name))
    return picturesList;
  }
  setPictures=(imgsList)=>{
    // console.log(imgsList);
    let fileList=[];
    imgsList.forEach((item,index)=>{
      fileList.push({uid:-index,name:item,url:`${BASE_URL}/upload/${item}`})
    })
    this.setState({fileList})
  }
  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          action={`${BASE_URL}/manage/img/upload`}
          method="post"
          name="image"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={this.handleRemove}
          multiple
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}

export default PicturesWall;