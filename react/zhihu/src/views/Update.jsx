import React, { useState } from "react";
import NavBarAgain from '../components/NavBarAgain';
import ButtonAgain from '../components/ButtonAgain';
import styled from "styled-components";
import { ImageUploader, Input, Toast } from 'antd-mobile';
import { connect } from 'react-redux';
import action from '../store/action';
import api from '../api';

/* 样式 */
const UpdateBox = styled.div`
    .formBox {
        padding: 30px;

        .item {
            display: flex;
            align-items: center;
            height: 110px;
            line-height: 110px;
            font-size: 28px;

            .label {
                width: 20%;
                text-align: center;
            }

            .input {
                width: 80%;
            }
        }
    }

    .submit {
        display: block;
        margin: 0 auto;
        width: 60%;
        height: 70px;
        font-size: 28px;
    }
`;

const Update = function Update(props) {
    let {info,queryUserInfoAsync,navigate}=props;
    // 定义状态
    let [pic,setPic]=useState([{url:info.pic}]),
    [username,setUsername]=useState(info.name);

    // 图片上传
    const limitImage=(file)=>{
        let limit=1*1024*1024
        if(file.size>limit){
            Toast.show({
                icon:'fail',
                content:'图片必须在1MB以内'
            })
        }
        return file

    }

    const uploadImage=async (file)=>{
        let temp;
        try {
            let {code,pic}=await api.upload(file)
            if(+code!==0){
                Toast.show({
                    icon:'fail',
                    content:'上传失败'
                })
            }
            temp=pic
            setPic([{
                url:pic
            }])
        } catch (error) {
            
        }

        return {url:temp}

    }

    // 提交信息
    const submit=async ()=>{
        if(pic.length===0){
            Toast.show({
                icon:'fail',
                content:'请先上传图片'
            })

            return 
        }

        // 获取信息，发送请求
        let [{url}]=pic
        try {
            let {code}=await api.userUpdate({username:username.trim(),url})
            if(+code!==0){

            }

            Toast.show({
                icon:'success',
                content:''
            })

        } catch (error) {
            
        }


        

    }




    return <UpdateBox>
        <NavBarAgain title="修改信息" />
        <div className="formBox">
            <div className="item">
                <div className="label">头像</div>
                <div className="input">
                    <ImageUploader value={pic
                }
                maxCount={1}
                onDelete={()=>{
                    setPic([])
                }}
                beforeUpload={limitImage}
                upload={uploadImage}
                    />
                </div>
            </div>
            <div className="item">
                <div className="label">姓名</div>
                <div className="input">
                    <Input placeholder='请输入账号名称' value={username} onChange={val=>{
                        setUsername(val)
                    }}/>
                </div>
            </div>
            <ButtonAgain color='primary' className="submit"
                >
                提交
            </ButtonAgain>
        </div>
    </UpdateBox>;
};
export default connect(
    state => state.base,
    action.base
)(Update);