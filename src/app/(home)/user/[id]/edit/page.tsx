'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createClient } from '@/supabase/client';
import { ChangeEventHandler, MouseEventHandler, useEffect, useState } from 'react';
import { User } from 'lucide-react';
import RandomNickname from '@/components/common/RandomNickname';
import { FormState } from '@/types/signUpFormType';
import NicknameSection from '@/components/common/NicknameSection';

type ChangePasswordFormProps = {
  onSubmit: (newPassword: string) => void;
};

const AccountEditPage: React.FC<ChangePasswordFormProps> = ({ onSubmit }) => {
  const supabase = createClient();
  const [userEmail, setUserEmail] = useState('');
  const [userNickname, setUserNickName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const initialState: FormState = {
    email: '',
    pw: '',
    confirmPw: '',
    nickname: '',
    recaptchaToken: ''
  };
  const handleNicknameGenerated = (nickname: string) => {
    setFormState((prev) => ({ ...prev, nickname }));
  };
  const [formState, setFormState] = useState<FormState>(initialState);
  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };
  const handleNicknameChange = (nickname: string) => {
    setFormState((prev) => ({ ...prev, nickname }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNewPassword(e.target.value);

    const { data: user, error } = await supabase.auth.updateUser({ password: newPassword });
    toast.success('수정되었습니다.');
    console.log(error);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
          error: userError
        } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (user) {
          const { data, error } = await supabase.from('user').select('email, nickname').eq('id', user.id).single();
          if (error) throw error;
          if (data) {
            setUserEmail(data.email ?? '');
            setUserNickName(data.nickname ?? '');
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, []);

  // 닉네임 바꾸기
  const updateNickname: React.MouseEventHandler<HTMLElement> = (e) => {
    e.preventDefault();
    // 새로고침 버튼을 누르면 닉네임이 랜덤 변경되는 함수 실행

    return toast.success('수정되었습니다.');
    // 변경된 닉네임은 setnickname -> nickname으로 저장
    // nickname을 supabase에 업데이트
  };

  return (
    <div className="bg-zinc-950 w-screen h-screen">
      <div className="text-white bg-zinc-950 w-[640px] h-screen border border-zinc-800 m-auto p-[30px] text-center ">
        <Image
          src={'/logo_icon.png'}
          alt="code_room logo icon"
          width="50"
          height="50"
          className="m-auto mt-[83px] mb-[60px]"
        />
        <div>
          <Input
            className="w-96 h-10 bg-[#71717A] border-zinc-600 p-4 m-auto mb-7 text-white placeholder:text-white placeholder:font-nomal"
            type="email"
            value={userEmail}
            disabled
          />
          <NicknameSection nickname={formState.nickname} onNicknameChange={handleNicknameChange} />
          <form
            onSubmit={(e) => {
              confirmPassword === newPassword ? handleSubmit(e) : toast.error('비밀번호를 확인해주세요.');
            }}
          >
            <Input
              className="w-96 h-10 bg-[#27272A] border-zinc-600 p-4 m-auto mb-7 text-white"
              type="password"
              placeholder="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              className="w-96 h-10 bg-[#27272A] border-zinc-600 p-4 m-auto mb-7 text-white"
              type="password"
              placeholder="confirm password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              required
            />
            <Button
              className="w-96 h-10 mt-8 bg-[#DD268E] border-0 font-bold hover:bg-[#FB2EA2] hover:text-white"
              variant="outline"
              type="submit"
            >
              수 정
            </Button>
            <Link href={`/user`}>
              <Button
                className="w-96 h-10 mt-5 bg-[#27272A] border-0 font-bold hover:bg-[#2d2d30] hover:text-white"
                variant="outline"
              >
                취 소
              </Button>
            </Link>
          </form>
        </div>
        <div>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            limit={1}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </div>
    </div>
  );
};

export default AccountEditPage;
