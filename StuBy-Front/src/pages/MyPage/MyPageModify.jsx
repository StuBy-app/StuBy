// src/pages/MyPage/MyPageModify.jsx
import { ChevronLeftIcon, SettingsIcon } from "lucide-react";
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
import api from "../../api/axios";

const FIELD_META = [
  { label: "아이디", key: "username", editable: false }, // 표 행은 편집 불가(이름은 상단에서만 수정)
  { label: "비밀번호", key: "password", editable: true },
  { label: "이메일", key: "email", editable: false },
  { label: "나이", key: "age", editable: true },
  { label: "성별", key: "gender", editable: true },
  { label: "소속", key: "affiliation", editable: true, type: "select" },
  { label: "학교명", key: "school", editable: true, type: "text" },
];

// 값 영역 위치/폭
const VALUE_LEFT = "left-[150px]";
const VALUE_WIDTH = "w-[270px]";

const MyPageModify = () => {
  const navigate = useNavigate();

  // ✅ 최초부터 여성/고등학생으로 세팅
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    age: "",
    gender: "female",
    affiliation: "고등학생",
    school: "",
  });

  const [editingField, setEditingField] = useState(null);  // 표 내부 편집용
  const [editingName, setEditingName] = useState(false);   // 상단 유저이름 인라인 편집
  const [showWithdrawalDialog, setShowWithdrawalDialog] = useState(false);
  const [isSchoolInputDisabled, setIsSchoolInputDisabled] = useState(false);
  const [loading, setLoading] = useState(true);

  // 프로필 불러오기 (응답이 와도 성별/소속은 강제로 여성/고등학생으로 덮어씀)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get("/api/users/profile");
        const p = res?.data?.data ?? res?.data ?? {};
        if (!mounted) return;

        setFormData(prev => ({
          ...prev,
          username: p?.username ?? "",
          password: "",
          email: p?.email ?? "",
          age: p?.age ?? "",
          school: p?.schoolName ?? p?.school ?? "",
          // ✅ 무조건 고정
          gender: "female",
          affiliation: "고등학생",
        }));
      } catch (err) {
        console.error("프로필 불러오기 실패:", err);
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          navigate("/auth/login", { replace: true });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  // '기타' 선택 시 학교명 입력 비활성화 (여긴 그대로 유지)
  useEffect(() => {
    if (formData.affiliation === "기타") {
      setIsSchoolInputDisabled(true);
      setFormData((prev) => ({ ...prev, school: "" }));
    } else {
      setIsSchoolInputDisabled(false);
    }
  }, [formData.affiliation]);

  const handleFieldClick = (keyOrLabel) => {
    const meta = FIELD_META.find(
      (m) => m.label === keyOrLabel || m.key === keyOrLabel
    );
    if (!meta) return;
    if (meta.key === "school" && isSchoolInputDisabled) return;
    if (meta.editable) setEditingField(meta.label);
  };

  // 상단 유저이름(테스터) 편집
  const handleNameClick = () => setEditingName(true);
  const closeNameEdit = () => setEditingName(false);

  const handleBackClick = () => navigate("/mypage");

  const handleConfirmClick = async () => {
    try {
      const payload = {
        username: formData.username, // 상단 이름 편집 반영
        email: formData.email,
        gender: formData.gender,           // => 항상 "female"
        affiliation: formData.affiliation, // => 항상 "고등학생"
        school: formData.school,
      };
      if (formData.password) payload.password = formData.password;

      const ageNumber = Number(formData.age);
      if (Number.isFinite(ageNumber) && ageNumber > 0) payload.age = ageNumber;

      await api.put("/api/users/profile", payload);
      navigate("/mypage");
    } catch (err) {
      console.error(err);
      alert("저장에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("AccessToken");
    navigate("/auth/login", { replace: true });
  };

  const handleWithdrawalConfirm = () => {
    setShowWithdrawalDialog(false);
    localStorage.removeItem("AccessToken");
    navigate("/auth/login", { replace: true });
  };

  const handleProfileImageEdit = () => {
    console.log("프로필 이미지 수정");
  };

  const handleFieldChange = (key, value) => {
    if (key === "age") {
      if (value === "") return setFormData((prev) => ({ ...prev, age: "" }));
      if (!/^\d+$/.test(value)) return;
    }
    setFormData((prev) => ({ ...prev, [key]: value }));
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
    <div
      className="bg-[#000] w-full min-h-screen flex items-center justify-center"
      data-model-id="31:486"
    >
      <main className="h-screen w-[480px] relative bg-[#f8f9ff] flex flex-col">
        <header className="absolute top-0 left-0 w-[480px] h-[76px]">
          <div className="absolute top-0 left-0 w-[480px] h-[76px] flex items=end bg-[#f8f9ff] shadow-[0px_2px_2px_#2323231a]">
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
          <div className="w-[430px] min-h-[460px] relative">
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

                {/* 유저이름: 클릭 시 자기 자신만 인라인 편집 */}
                {!editingName ? (
                  <button
                    onClick={handleNameClick}
                    className="top-[95px] left-[calc(50%-35px)] [font-family:'Noto_Sans_KR',Helvetica] font-bold text-[#232323] text-xl leading-4 whitespace-nowrap absolute tracking-[0] hover:text-[#628af9] cursor-pointer transition-colors"
                  >
                    {formData.username || "테스터"}
                  </button>
                ) : (
                  <Input
                    autoFocus
                    value={formData.username}
                    onChange={(e) => handleFieldChange("username", e.target.value)}
                    onBlur={closeNameEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === "Escape") {
                        e.currentTarget.blur();
                      }
                    }}
                    className="top-[90px] left-[calc(50%_-_70px)] absolute w-[140px] h-[28px] border border-[#628af9] rounded px-2 [font-family:'Noto_Sans_KR',Helvetica] text-[14px] focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
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
            <Card className="absolute top-[136px] left-0 w-[430px] h-[320px] rounded-[10px] border-2 border-[#628af9] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
              <CardContent className="p-0 relative h-full">
                <div className="absolute top-[25px] left-[35px] w-[74px] [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#23232366] text-[10px] leading-4 tracking-[0]">
                  회원 정보 수정
                </div>

                {FIELD_META.map((field, index) => (
                  <div key={field.label}>
                    {/* 라벨 */}
                    <div
                      className={`absolute ${
                        index === 0
                          ? "top-14"
                          : index === 1
                          ? "top-[82px]"
                          : index === 2
                          ? "top-[112px]"
                          : index === 3
                          ? "top-[142px]"
                          : index === 4
                          ? "top-[180px]"
                          : index === 5
                          ? "top-[215px]"
                          : "top-[255px]"
                      } left-[35px] [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] text-sm leading-4 tracking-[0]`}
                    >
                      {field.label}
                    </div>

                    {/* 값 컨트롤 */}
                    {field.label === "소속" ? (
                      <div className={`absolute top-[215px] ${VALUE_LEFT} ${VALUE_WIDTH}`}>
                        <Select
                          value={formData.affiliation}
                          onValueChange={(v) => handleFieldChange("affiliation", v)}
                        >
                          <SelectTrigger className="h-[32px] w-full border border-[#628af9] rounded px-2 [font-family:'Noto_Sans_KR',Helvetica] font-normal text-[12px] text-[#232323] leading-4 focus:ring-0 focus:ring-offset-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent position="popper" className="w-[200px]" sideOffset={5}>
                            <SelectItem value="중학생">중학생</SelectItem>
                            <SelectItem value="고등학생">고등학생</SelectItem>
                            <SelectItem value="기타">기타</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : field.label === "학교명" ? (
                      <div className={`absolute top-[255px] ${VALUE_LEFT} ${VALUE_WIDTH} flex items-center`}>
                        {editingField === field.label ? (
                          <Input
                            autoFocus
                            value={formData.school}
                            onChange={(e) => handleFieldChange("school", e.target.value)}
                            onBlur={handleFieldBlur}
                            disabled={isSchoolInputDisabled}
                            placeholder="학교를 입력하세요"
                            className={`h-[32px] w-full border border-[#628af9] rounded px-2 [font-family:'Noto_Sans_KR',Helvetica] text-[12px] focus-visible:ring-0 focus-visible:ring-offset-0 ${
                              isSchoolInputDisabled ? "bg-gray-100 cursor-not-allowed" : ""
                            }`}
                          />
                        ) : (
                          <span className="w-full text-left [font-family:'Noto_Sans_KR',Helvetica] text-[10px] leading-4 text-[#23232380]">
                            {formData.school || "동래여자고등학교"}
                          </span>
                        )}
                      </div>
                    ) : field.label === "성별" ? (
                      <ToggleGroup
                        type="single"
                        value={formData.gender}
                        onValueChange={(v) => v && handleFieldChange("gender", v)}
                        className={`absolute top-[180px] ${VALUE_LEFT} gap-[10px]`}
                      >
                        <ToggleGroupItem
                          value="male"
                          className="w-[48px] h-[32px] bg-white rounded-[38px] border border-[#628af9] text-[12px] [font-family:'Noto_Sans_KR',Helvetica] text-[#23232380] leading-4 p-0 data-[state=on]:bg-[#628af9] data-[state=on]:text-[#f8f9ff] flex items-center justify-center"
                        >
                          남성
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="female"
                          className="w-[48px] h-[32px] bg-white rounded-[38px] border border-[#628af9] text-[12px] [font-family:'Noto_Sans_KR',Helvetica] text-[#23232380] leading-4 p-0 data-[state=on]:bg-[#628af9] data-[state=on]:text-[#f8f9ff] flex items-center justify-center"
                        >
                          여성
                        </ToggleGroupItem>
                      </ToggleGroup>
                    ) : field.editable && editingField === field.label ? (
                      <Input
                        autoFocus
                        type={field.label === "비밀번호" ? "password" : field.label === "나이" ? "number" : "text"}
                        value={
                          field.label === "비밀번호"
                            ? formData.password
                            : field.label === "나이"
                            ? formData.age
                            : ""
                        }
                        onChange={(e) => {
                          const key =
                            field.label === "비밀번호"
                              ? "password"
                              : field.label === "나이"
                              ? "age"
                              : "";
                          if (key) handleFieldChange(key, e.target.value);
                        }}
                        onBlur={handleFieldBlur}
                        className={`absolute ${
                          index === 1
                            ? "top-[82px]"
                            : index === 3
                            ? "top-[142px]"
                            : ""
                        } ${VALUE_LEFT} ${VALUE_WIDTH} h-[32px] border border-[#628af9] rounded px-2 [font-family:'Noto_Sans_KR',Helvetica] text-[12px] leading-4 tracking-[0] focus-visible:ring-0 focus-visible:ring-offset-0`}
                      />
                    ) : (
                      // 표시 모드(아이디는 항상 비편집, 클릭 불가)
                      <span
                        className={`absolute ${
                          index === 0
                            ? "top-14"
                            : index === 1
                            ? "top-[82px]"
                            : index === 2
                            ? "top-[112px]"
                            : index === 3
                            ? "top-[142px]"
                            : index === 4
                            ? "top-[172px]"
                            : index === 5
                            ? "top-[202px]"
                            : "top-[232px]"
                        } ${VALUE_LEFT} [font-family:'Noto_Sans_KR',Helvetica] font-normal text-[10px] leading-4 tracking-[0] text-[#23232380] text-left`}
                      >
                        {field.label === "아이디"
                          ? formData.username || "test1"
                          : field.label === "비밀번호"
                          ? "••••••••"
                          : field.label === "이메일"
                          ? formData.email || "test1@test.com"
                          : field.label === "나이"
                          ? formData.age
                            ? `${formData.age}`
                            : "18세"
                          : field.label === "소속"
                          ? formData.affiliation // => "고등학생"
                          : formData.school}
                      </span>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 하단 버튼/네비 */}
            <div className="absolute top-[490px] left-[90px] w-[252px] h-[45px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
              <Button
                onClick={handleConfirmClick}
                className="w-[250px] h-[45px] bg-[#628af9] rounded-[15px] border-2 border-solid hover:bg-[#5279e0] transition-colors"
              >
                <span className="[font-family:'Inter',Helvetica] font-medium text-[#f8f9ff] text-xs leading-[normal] tracking-[0]">
                  확인
                </span>
              </Button>
            </div>

            <nav className="absolute top-[540px] left-[calc(50%_-_43px)] w-[93px] h-3 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:800ms]">
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
