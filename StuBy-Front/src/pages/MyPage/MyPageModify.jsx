import { ChevronLeftIcon, SearchIcon, SettingsIcon, EditIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button";
import { Card, CardContent } from "../../components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/dialog";
import { Input } from "../../components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/select";
import { Separator } from "../../components/separator";
import { ToggleGroup, ToggleGroupItem } from "../../components/toggle-group";
import api from "../../api/axios"

/**
 * 서버 데이터로 필드 렌더를 돌리기 위해 label/편집가능여부만 정의
 * value는 formData에서 주입합니다.
 */
const FIELD_META = [
  { label: "아이디", key: "username", editable: false },
  { label: "비밀번호", key: "password", editable: true },
  { label: "이메일", key: "email", editable: false },
  { label: "성별", key: "gender", editable: true },           // 토글 그룹
  { label: "소속", key: "affiliation", editable: true, type: "select" },
  { label: "학교명", key: "school", editable: true, type: "search" },
];

const MyPageModify = () => {
  const navigate = useNavigate();

  // 실제 서버 데이터가 들어갈 상태
  const [formData, setFormData] = useState({
    username: "",      // 아이디(로그인 ID)
    password: "",      // 비밀번호는 서버에서 내려주지 않으면 빈값 유지
    email: "",
    gender: "",        // "male" | "female"
    affiliation: "",   // "중학생" | "고등학생" | "기타" 등
    school: "",
  });

  const [editingField, setEditingField] = useState(null);
  const [showWithdrawalDialog, setShowWithdrawalDialog] = useState(false);
  const [isSchoolInputDisabled, setIsSchoolInputDisabled] = useState(false);
  const [loading, setLoading] = useState(true);

  // 프로필 불러오기
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get("/api/users/profile"); // Authorization 헤더는 axios 인터셉터로 처리됨
        if (!mounted) return;

        // 백엔드 응답 필드명에 맞춰 매핑하세요.
        // 아래는 예시: { username, email, gender, affiliation, school }
        setFormData({
          username: data?.username ?? "",
          password: "", // 보안상 서버가 비번을 내려주진 않으므로 비워둠
          email: data?.email ?? "",
          gender: data?.gender ?? "", // "male" | "female"
          affiliation: data?.affiliation ?? "",
          school: data?.school ?? "",
        });
      } catch (err) {
        console.error(err);
        // 토큰 만료 등 실패 시 로그인으로 이동
        navigate("/login");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [navigate]);

  // '기타'면 학교명 비활성화
  useEffect(() => {
    if (formData.affiliation === "기타") {
      setIsSchoolInputDisabled(true);
      setFormData(prev => ({ ...prev, school: "" }));
    } else {
      setIsSchoolInputDisabled(false);
    }
  }, [formData.affiliation]);

  const handleFieldClick = (label) => {
    const meta = FIELD_META.find(m => m.label === label);
    if (!meta) return;
    if (meta.editable) {
      if (label === "학교명" && isSchoolInputDisabled) return;
      setEditingField(label);
    } else if (label === "username") {
      setEditingField(label);
    }
  };

  const handleBackClick = () => navigate("/mypage");

  const handleConfirmClick = async () => {
    try {
      // 비밀번호를 수정하지 않으면 필드에서 제외해도 됩니다.
      const payload = {
        username: formData.username,
        email: formData.email,
        gender: formData.gender,
        affiliation: formData.affiliation,
        school: formData.school,
      };
      if (formData.password) payload.password = formData.password;

      await api.put("/api/users/profile", payload);
      navigate("/mypage");
    } catch (err) {
      console.error(err);
      alert("저장에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const handleLogout = () => {
    // 필요 시 토큰 제거
    localStorage.removeItem("AccessToken");
    navigate("/login");
  };

  const handleWithdrawalConfirm = () => {
    setShowWithdrawalDialog(false);
    // 실제 탈퇴 API가 있다면 호출하세요.
    localStorage.removeItem("AccessToken");
    navigate("/login");
  };

  const handleProfileImageEdit = () => {
    console.log("프로필 이미지 수정");
  };

  const handleFieldChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFieldBlur = () => setEditingField(null);

  if (loading) {
    return (
      <div className="bg-[#000] w-full min-h-screen flex items-center justify-center">
        <div className="h-screen w-[480px] bg-[#f8f9ff] flex items-center justify-center">
          <p className="text-sm text-[#232323]">프로필 불러오는 중…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#000] w-full min-h-screen flex items-center justify-center" data-model-id="31:486">
      <main className="h-screen w-[480px] relative bg-[#f8f9ff] flex flex-col">
        <header className="absolute top-0 left-0 w-[480px] h-[76px]">
          <div className="absolute top-0 left-0 w-[480px] h-[76px] flex items-end bg-[#f8f9ff] shadow-[0px_2px_2px_#2323231a]">
            <div className="h-12 flex-1 bg-[#f8f9ff]" />
          </div>

          <div className="absolute top-[calc(50%_-_6px)] left-[calc(50%_-_46px)] w-[92px] h-[38px] bg-[url(https://c.animaapp.com/mghllw7nnesCnv/img/logo-1-8.png)] bg-cover bg-[50%_50%]" />

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
            {/* 프로필 + 이름 */}
            <div className="absolute top-[calc(50%_-_230px)] left-[calc(50%_-_40px)] w-[94px] h-[111px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
              <div className="absolute top-0 left-[calc(50%_-_47px)] w-24 h-[111px]">
                <div className="absolute top-0 left-[calc(50%_-_48px)] w-20 h-20 rounded-full overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt="profile"
                    src="https://c.animaapp.com/mghllw7nnesCnv/img/ellipse-9-1.png"
                  />
                </div>

                {/* 아이디(이름) 편집: 필요 시 열어두기, 기본은 읽기 */}
                {editingField === "username" ? (
                  <Input
                    autoFocus
                    value={formData.username}
                    onChange={(e) => handleFieldChange("username", e.target.value)}
                    onBlur={handleFieldBlur}
                    className="absolute top-[95px] left-[calc(50%_-_45px)] w-[90px] h-[20px] border border-[#628af9] rounded px-2 [font-family:'Noto_Sans_KR',Helvetica] font-bold text-[#232323] text-xl leading-4 tracking-[0] focus-visible:ring-0 focus-visible:ring-offset-0 text-center"
                  />
                ) : (
                  <button
                    onClick={() => handleFieldClick("username")}
                    className="top-[95px] left-[calc(50%_-_45px)] [font-family:'Noto_Sans_KR',Helvetica] font-bold text-[#232323] text-xl leading-4 whitespace-nowrap absolute tracking-[0] hover:text-[#628af9] cursor-pointer transition-colors"
                  >
                    {formData.username || "이름"}
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

            {/* 카드: 회원 정보 수정 */}
            <Card className="absolute top-[136px] left-0 w-[430px] h-[227px] rounded-[10px] border-2 border-[#628af9] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
              <CardContent className="p-0 relative h-full">
                <div className="absolute top-[25px] left-[35px] w-[74px] [font-family:'Noto_SANS_KR',Helvetica] font-medium text-[#23232366] text-[10px] leading-4 tracking-[0]">
                  회원 정보 수정
                </div>

                {FIELD_META.map((field, index) => (
                  <div key={field.label}>
                    {/* 라벨 위치 */}
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

                    {/* 소속 */}
                    {field.label === "소속" ? (
                      <div className="absolute top-40 left-[142px] w-[200px]">
                        <Select
                          value={formData.affiliation}
                          onValueChange={(v) => handleFieldChange("affiliation", v)}
                        >
                          <SelectTrigger className="w-full h-[20px] border-0 bg-transparent rounded-none px-0 [font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#23232380] text-[10px] leading-4 tracking-[0] focus:ring-0 focus:ring-offset-0 hover:text-[#628af9] transition-colors [&>svg]:hidden">
                            <SelectValue placeholder="소속 선택" />
                          </SelectTrigger>
                          <SelectContent position="popper" className="w-[200px]" sideOffset={5}>
                            <SelectItem value="중학생">중학생</SelectItem>
                            <SelectItem value="고등학생">고등학생</SelectItem>
                            <SelectItem value="기타">기타</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : field.label === "학교명" ? (
                      // 학교명
                      <div className="absolute top-[186px] left-[142px] w-[200px] flex items-center gap-2">
                        {editingField === field.label ? (
                          <Input
                            autoFocus
                            value={formData.school}
                            onChange={(e) => handleFieldChange("school", e.target.value)}
                            onBlur={handleFieldBlur}
                            disabled={isSchoolInputDisabled}
                            className={`flex-1 h-[20px] border border-[#628af9] rounded px-2 [font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#232323] text-[10px] leading-4 tracking-[0] focus-visible:ring-0 focus-visible:ring-offset-0 ${
                              isSchoolInputDisabled ? "bg-gray-100 cursor-not-allowed" : ""
                            }`}
                          />
                        ) : (
                          <button
                            onClick={() => handleFieldClick(field.label)}
                            disabled={!field.editable || isSchoolInputDisabled}
                            className={`flex-1 text-left [font-family:'Noto_Sans_KR',Helvetica] font-normal text-[10px] leading-4 tracking-[0] ${
                              field.editable && !isSchoolInputDisabled
                                ? "hover:text-[#628af9] cursor-pointer text-[#23232380]"
                                : "cursor-default text-[#23232380]"
                            }`}
                          >
                            {formData.school || "학교를 입력하세요"}
                          </button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleFieldClick(field.label)}
                          disabled={isSchoolInputDisabled}
                          className={`w-5 h-5 p-0 hover:bg-transparent ${
                            isSchoolInputDisabled ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <SearchIcon className="w-4 h-4 text-[#232323]" />
                        </Button>
                      </div>
                    ) : field.label === "성별" ? (
                      // 성별
                      <ToggleGroup
                        type="single"
                        value={formData.gender}
                        onValueChange={(v) => v && handleFieldChange("gender", v)}
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
                      // 비밀번호/이메일 편집 인풋
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
                          const key =
                            field.label === "비밀번호"
                              ? "password"
                              : field.label === "이메일"
                              ? "email"
                              : "";
                          if (key) handleFieldChange(key, e.target.value);
                        }}
                        onBlur={handleFieldBlur}
                        className={`absolute ${
                          index === 1 ? "top-[82px]" : index === 2 ? "top-[108px]" : ""
                        } left-[142px] w-[200px] h-[20px] border border-[#628af9] rounded px-2 [font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#232323] text-[10px] leading-4 tracking-[0] focus-visible:ring-0 focus-visible:ring-offset-0`}
                      />
                    ) : (
                      // 일반 표시 버튼(클릭으로 편집 전환)
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
                          field.editable
                            ? "hover:text-[#628af9] cursor-pointer text-[#23232380]"
                            : "cursor-default text-[#23232380]"
                        } text-left`}
                      >
                        {field.label === "아이디"
                          ? formData.username
                          : field.label === "비밀번호"
                          ? "••••••••"
                          : field.label === "이메일"
                          ? formData.email
                          : field.label === "소속"
                          ? (formData.affiliation || "선택")
                          : formData.school}
                      </button>
                    )}

                    {/* 연필 아이콘 (특수 필드 제외) */}
                    {field.editable &&
                      editingField !== field.label &&
                      field.label !== "아이디" &&
                      field.label !== "이메일" &&
                      field.label !== "비밀번호" &&
                      field.label !== "학교명" &&
                      field.label !== "소속" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleFieldClick(field.label)}
                          className={`absolute ${
                            index === 1 ? "top-[82px]" : index === 4 ? "top-40" : "top-[186px]"
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

            <nav className="absolute top-[448px] left-[calc(50%_-_43px)] w-[93px] h-3 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:800ms]">
              <Button
                variant="link"
                onClick={handleLogout}
                className="absolute top-0 left-[calc(50%_-_46px)] h-auto p-0 [font-family:'Inter',Helvetica] font-normal text-[#23232366] text-[10px] leading-[normal] whitespace-nowrap tracking-[0] hover:no-underline"
              >
                로그아웃
              </Button>

              <span className="absolute top-0 left-[42px] [font-family:'Inter',Helvetica] font-normal text-[#23232380] text-[10px] leading-[normal] whitespace-nowrap tracking-[0]">
                ∙
              </span>

              <Button
                variant="link"
                onClick={() => setShowWithdrawalDialog(true)}
                className="absolute top-0 left-[calc(50%_+_4px)] h-auto p-0 [font-family:'Inter',Helvetica] font-normal text-[#23232366] text-[10px] leading-[normal] whitespace-nowrap tracking-[0] hover:no-underline"
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

export default MyPageModify;
