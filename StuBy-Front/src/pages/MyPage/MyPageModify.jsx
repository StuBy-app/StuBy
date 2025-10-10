import { ChevronLeftIcon, SearchIcon, SettingsIcon, EditIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";

const userInfoFields = [
  { label: "아이디", value: "test1", editable: false },
  { label: "비밀번호", value: "qwer1234", editable: true },
  { label: "이메일", value: "test1@gmail.com", editable: false }, // 이메일 수정 불가
  { label: "성별", value: "gender", editable: false },
  { label: "소속", value: "고등학생", editable: true, type: "select" },
  { label: "학교명", value: "xx고등학교", editable: true, type: "search" },
];

export const MyPageModify = (): JSX.Element => {
  const navigate = useNavigate();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "유저이름",
    password: "qwer1234",
    email: "test1@gmail.com",
    gender: "female",
    affiliation: "고등학생",
    school: "xx고등학교",
  });
  const [showSchoolSearch, setShowSchoolSearch] = useState(false);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState("");
  const [showWithdrawalDialog, setShowWithdrawalDialog] = useState(false);
  const [isSchoolInputDisabled, setIsSchoolInputDisabled] = useState(false);

  useEffect(() => {
    if (formData.affiliation === "기타") {
      setIsSchoolInputDisabled(true);
      setFormData((prev) => ({ ...prev, school: "" })); // '기타' 선택 시 학교명 초기화
    } else {
      setIsSchoolInputDisabled(false);
    }
  }, [formData.affiliation]);

  const handleFieldClick = (fieldName: string) => {
    const field = userInfoFields.find((f) => f.label === fieldName);
    if (field && field.editable) {
      if (fieldName === "학교명" && isSchoolInputDisabled) {
        return; // '기타' 소속일 경우 학교명 클릭 불가
      }
      setEditingField(fieldName);
    } else if (fieldName === "username") {
      setEditingField(fieldName);
    }
  };

  const handleBackClick = () => {
    navigate("/u4358u4449u4363u4469u4369u4454u4363u4469u4364u4469");
  };

  const handleConfirmClick = () => {
    console.log("저장된 정보:", formData); // 정보 저장 로직 (콘솔 출력)
    navigate("/u4358u4449u4363u4469u4369u4454u4363u4469u4364u4469"); // 마이페이지로 이동
  };

  const handleLogout = () => {
    // 로그아웃 로직
    console.log("로그아웃");
    navigate("/u4357u4457u4352u4467u4363u4469u4523-u4363u4457u4357u4466"); // 로그인 화면으로 이동
  };

  const handleWithdrawalConfirm = () => {
    // 회원탈퇴 로직
    console.log("회원탈퇴 완료");
    setShowWithdrawalDialog(false);
    navigate("/u4357u4457u4352u4467u4363u4469u4523-u4363u4457u4357u4466"); // 로그인 화면으로 이동
  };

  const handleProfileImageEdit = () => {
    console.log("프로필 이미지 수정");
    // 이미지 수정 기능 구현 (예: 파일 업로드 모달 열기)
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleFieldBlur = () => {
    setEditingField(null);
    setShowSchoolSearch(false);
  };

  const handleSchoolSelect = (school: string) => {
    setFormData((prev) => ({
      ...prev,
      school: school,
    }));
    setShowSchoolSearch(false);
    setEditingField(null);
  };

  return (
    <div
      className="bg-[#000] w-full min-h-screen flex items-center justify-center"
      data-model-id="31:486"
    >
      <main className="h-screen w-[480px] relative bg-[#f8f9ff] flex flex-col">
        <header className="absolute top-0 left-0 w-[480px] h-[76px]">
          <div className="absolute top-0 left-0 w-[480px] h-[76px] flex items-end bg-[#f8f9ff] shadow-[0px_2px_2px_#2323231a]">
            <div className="h-12 flex-1 bg-[#f8f9ff]" />
          </div>

          <div className="absolute top-[calc(50.00%_-_6px)] left-[calc(50.00%_-_46px)] w-[92px] h-[38px] bg-[url(https://c.animaapp.com/mghllw7nnesCnv/img/logo-1-8.png)] bg-cover bg-[50%_50%]" />

          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackClick}
            className="absolute top-[37px] left-6 w-6 h-6 p-0 hover:bg-transparent"
          >
            <ChevronLeftIcon className="w-6 h-6 text-[#232323] hover:text-[#628af9] transition-colors" />
          </Button>
        </header>

        <section className="flex-1 overflow-y-auto scrollbar-hide flex items-center justify-center">
          <div className="w-[430px] h-[460px] relative">
            <div className="absolute top-[calc(50.00%_-_230px)] left-[calc(50.00%_-_40px)] w-[94px] h-[111px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
              <div className="absolute top-0 left-[calc(50.00%_-_47px)] w-24 h-[111px]">
                <div className="absolute top-0 left-[calc(50.00%_-_48px)] w-20 h-20 rounded-full overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt="Ellipse"
                    src="https://c.animaapp.com/mghllw7nnesCnv/img/ellipse-9-1.png"
                  />
                </div>

                {editingField === "username" ? (
                  <Input
                    autoFocus
                    value={formData.username}
                    onChange={(e) => handleFieldChange("username", e.target.value)}
                    onBlur={handleFieldBlur}
                    className="absolute top-[95px] left-[calc(50.00%_-_45px)] w-[90px] h-[20px] border border-[#628af9] rounded px-2 [font-family:'Noto_Sans_KR',Helvetica] font-bold text-[#232323] text-xl leading-4 tracking-[0] focus-visible:ring-0 focus-visible:ring-offset-0 text-center"
                  />
                ) : (
                  <button
                    onClick={() => handleFieldClick("username")}
                    className="top-[95px] left-[calc(50.00%_-_45px)] [font-family:'Noto_Sans_KR',Helvetica] font-bold text-[#232323] text-xl leading-4 whitespace-nowrap absolute tracking-[0] hover:text-[#628af9] cursor-pointer transition-colors"
                  >
                    {formData.username}
                  </button>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleProfileImageEdit}
                  className="absolute w-6 h-6 top-[55px] left-[55px] p-0 rounded-full bg-white shadow-sm"
                >
                  <SettingsIcon className="w-4 h-4 text-[#628af9]" />
                </Button>
              </div>
            </div>

          <Card className="absolute top-[136px] left-0 w-[430px] h-[227px] rounded-[10px] border-2 border-[#628af9] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
            <CardContent className="p-0 relative h-full">
              <div className="absolute top-[25px] left-[35px] w-[74px] [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#23232366] text-[10px] leading-4 tracking-[0]">
                회원 정보 수정
              </div>

              {userInfoFields.map((field, index) => (
                <div key={index}>
                  <div
                    className={`absolute ${
                      index === 0
                        ? "top-14"
                        : index === 1
                          ? "top-[82px]"
                          : index === 2
                            ? "top-[108px]"
                            : index === 3
                              ? "top-[134px]"
                              : index === 4
                                ? "top-40"
                                : "top-[186px]"
                    } left-[35px] [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] text-sm leading-4 tracking-[0]`}
                  >
                    {field.label}
                  </div>

                  {field.label === "소속" ? (
                    <div className="absolute top-40 left-[142px] w-[200px]">
                      <Select
                        value={formData.affiliation}
                        onValueChange={(value) => {
                          handleFieldChange("affiliation", value);
                        }}
                      >
                        <SelectTrigger
                          className={`w-full h-[20px] border-0 bg-transparent rounded-none px-0 [font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#23232380] text-[10px] leading-4 tracking-[0] focus:ring-0 focus:ring-offset-0 hover:text-[#628af9] transition-colors [&>svg]:hidden`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          className="w-[200px]"
                          sideOffset={5}
                        >
                          <SelectItem value="중학생">중학생</SelectItem>
                          <SelectItem value="고등학생">고등학생</SelectItem>
                          <SelectItem value="기타">기타</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : field.label === "학교명" ? (
                    <div className="absolute top-[186px] left-[142px] w-[200px] flex items-center gap-2">
                      {editingField === field.label ? (
                        <Input
                          autoFocus
                          value={formData.school}
                          onChange={(e) => handleFieldChange("school", e.target.value)}
                          onBlur={handleFieldBlur}
                          disabled={isSchoolInputDisabled}
                          className={`flex-1 h-[20px] border border-[#628af9] rounded px-2 [font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#232323] text-[10px] leading-4 tracking-[0] focus-visible:ring-0 focus-visible:ring-offset-0 ${isSchoolInputDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        />
                      ) : (
                        <button
                          onClick={() => handleFieldClick(field.label)}
                          disabled={!field.editable || isSchoolInputDisabled}
                          className={`flex-1 text-left [font-family:'Noto_Sans_KR',Helvetica] font-normal text-[10px] leading-4 tracking-[0] ${
                            field.editable && !isSchoolInputDisabled ? "hover:text-[#628af9] cursor-pointer text-[#23232380]" : "cursor-default text-[#23232380]"
                          }`}
                        >
                          {formData.school}
                        </button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleFieldClick(field.label)}
                        disabled={isSchoolInputDisabled}
                        className={`w-5 h-5 p-0 hover:bg-transparent ${isSchoolInputDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <SearchIcon className="w-4 h-4 text-[#232323]" />
                      </Button>
                    </div>
                  ) : field.label === "성별" ? (
                    <ToggleGroup
                      type="single"
                      value={formData.gender}
                      onValueChange={(value) => {
                        if (value) handleFieldChange("gender", value);
                      }}
                      className="absolute top-[133px] left-[142px] gap-[10px]"
                    >
                      <ToggleGroupItem
                        value="male"
                        className="w-[41px] h-[18px] bg-white rounded-[38px] border border-[#628af9] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#23232380] leading-4 p-0 data-[state=on]:bg-[#628af9] data-[state=on]:text-[#f8f9ff] flex items-center justify-center"
                      >
                        남성
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="female"
                        className="w-[41px] h-[18px] bg-white rounded-[38px] border border-[#628af9] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#23232380] leading-4 p-0 data-[state=on]:bg-[#628af9] data-[state=on]:text-[#f8f9ff] flex items-center justify-center"
                      >
                        여성
                      </ToggleGroupItem>
                    </ToggleGroup>
                  ) : field.editable && editingField === field.label ? (
                    <Input
                      autoFocus
                      type={field.label === "비밀번호" ? "password" : "text"}
                      value={
                        field.label === "비밀번호"
                          ? formData.password
                          : field.label === "이메일"
                            ? formData.email
                            : ""
                      }
                      onChange={(e) => {
                        const fieldName =
                          field.label === "비밀번호"
                            ? "password"
                            : field.label === "이메일"
                              ? "email"
                              : "";
                        if (fieldName) handleFieldChange(fieldName, e.target.value);
                      }}
                      onBlur={handleFieldBlur}
                      className={`absolute ${
                        index === 1
                          ? "top-[82px]"
                          : index === 2
                            ? "top-[108px]"
                            : ""
                      } left-[142px] w-[200px] h-[20px] border border-[#628af9] rounded px-2 [font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#232323] text-[10px] leading-4 tracking-[0] focus-visible:ring-0 focus-visible:ring-offset-0`}
                    />
                  ) : (
                    <button
                      onClick={() => handleFieldClick(field.label)}
                      disabled={!field.editable}
                      className={`absolute ${
                        index === 0
                          ? "top-14"
                          : index === 1
                            ? "top-[82px]"
                            : index === 2
                              ? "top-[108px]"
                              : index === 4
                                ? "top-40"
                                : "top-[186px]"
                      } left-[142px] [font-family:'Noto_Sans_KR',Helvetica] font-normal text-[10px] leading-4 tracking-[0] ${
                        field.editable ? "hover:text-[#628af9] cursor-pointer text-[#23232380]" : "cursor-default text-[#23232380]"
                      } text-left`}
                    >
                      {field.label === "아이디"
                        ? "test1"
                        : field.label === "비밀번호"
                          ? "••••••••"
                          : field.label === "이메일"
                            ? formData.email
                            : field.label === "소속"
                              ? formData.affiliation
                              : formData.school}
                    </button>
                  )}

                  {field.editable && editingField !== field.label && field.label !== "아이디" && field.label !== "이메일" && field.label !== "비밀번호" && field.label !== "학교명" && field.label !== "소속" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleFieldClick(field.label)}
                      className={`absolute ${
                        index === 1
                          ? "top-[82px]"
                          : index === 4
                            ? "top-40"
                            : "top-[186px]"
                      } left-[385px] w-[2.40%] h-[2.75%] p-0 hover:bg-transparent`}
                    >
                      <EditIcon className="w-full h-full text-[#232323]" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="absolute top-[398px] left-[90px] w-[252px] h-[45px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
            <Button
              onClick={handleConfirmClick}
              className="w-[250px] h-[45px] bg-[#628af9] rounded-[15px] border-2 border-solid hover:bg-[#5279e0] transition-colors"
            >
              <span className="[font-family:'Inter',Helvetica] font-medium text-[#f8f9ff] text-xs leading-[normal] tracking-[0]">
                확인
              </span>
            </Button>
          </div>

          <nav className="absolute top-[448px] left-[calc(50.00%_-_43px)] w-[93px] h-3 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:800ms]">
            <Button
              variant="link"
              onClick={handleLogout}
              className="absolute top-0 left-[calc(50.00%_-_46px)] h-auto p-0 [font-family:'Inter',Helvetica] font-normal text-[#23232366] text-[10px] leading-[normal] whitespace-nowrap tracking-[0] hover:no-underline"
            >
              로그아웃
            </Button>

            <span className="absolute top-0 left-[42px] [font-family:'Inter',Helvetica] font-normal text-[#23232380] text-[10px] leading-[normal] whitespace-nowrap tracking-[0]">
              ∙
            </span>

            <Button
              variant="link"
              onClick={() => setShowWithdrawalDialog(true)}
              className="absolute top-0 left-[calc(50.00%_+_4px)] h-auto p-0 [font-family:'Inter',Helvetica] font-normal text-[#23232366] text-[10px] leading-[normal] whitespace-nowrap tracking-[0] hover:no-underline"
            >
              회원탈퇴
            </Button>
          </nav>
          </div>
        </section>
      </main>

      <Dialog open={showWithdrawalDialog} onOpenChange={setShowWithdrawalDialog}>
        <DialogContent className="w-[270px] bg-[#f8f9ff] rounded-[15px] border-0 p-0 gap-0">
          <DialogHeader className="pt-[40px] px-6 pb-0 space-y-0">
            <DialogTitle className="font-bold text-[#232323] text-sm text-center [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal]">
              정말로 탈퇴하시겠습니까?
            </DialogTitle>
            <DialogDescription className="font-normal text-[#23232399] text-[11px] text-center [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] pt-[22px]">
              탈퇴 시 모든 정보가 삭제됩니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col items-center pt-[20px] pb-[15px] px-0">
            <Separator className="w-full bg-[#23232333]" />
            <div className="flex w-full justify-center gap-8 pt-3">
              <Button
                onClick={handleWithdrawalConfirm}
                className="font-bold text-[#ff6b6b] text-xs [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] bg-transparent hover:bg-transparent shadow-none border-0 h-auto"
              >
                확인
              </Button>
              <Button
                onClick={() => setShowWithdrawalDialog(false)}
                className="font-bold text-[#628af9] text-xs [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] bg-transparent hover:bg-transparent shadow-none border-0 h-auto"
              >
                취소
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
