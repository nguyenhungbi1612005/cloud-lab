try:
    from colorama import init, Fore, Style
    init(autoreset=True)
    COLOR_OK = Fore.GREEN
    COLOR_ERR = Fore.RED
    COLOR_WARN = Fore.YELLOW
    COLOR_TITLE = Fore.CYAN + Style.BRIGHT
    COLOR_RESET = Style.RESET_ALL
except ImportError:
    # Nếu chưa cài colorama, chương trình vẫn chạy bình thường (không màu)
    COLOR_OK = COLOR_ERR = COLOR_WARN = COLOR_TITLE = COLOR_RESET = ""
 
import csv
 
 

def tinh_diem_trung_binh(diem1, diem2, diem3):
    tong = diem1 + diem2 + diem3
    trung_binh = tong / 3
    return round(trung_binh, 2)
def phan_loai_diem(diem_tb): 
    if diem_tb >= 9.0: 
        return "Xuất sắc" 
    elif diem_tb >= 8.0: 
        return "Giỏi" 
    elif diem_tb >= 7.0: 
        return "Khá" 
    elif diem_tb >= 5.0: 
        return "Trung bình" 
    else: 
        return "Yếu"
def nhap_hoc_vien(): 
    ten = input("Nhập tên học viên: ") 
    ma_sv = input("Nhập mã SV: ") 
    diem1 = float(input("Nhập điểm kiểm tra 1: ")) 
    diem2 = float(input("Nhập điểm kiểm tra 2: ")) 
    diem3 = float(input("Nhập điểm kiểm tra 3: ")) 
    diem_tb = tinh_diem_trung_binh(diem1, diem2, diem3) 
    xep_loai = phan_loai_diem(diem_tb) 
    return { 
        "ten": ten, 
        "ma_sv": ma_sv, 
        "diem1": diem1, 
        "diem2": diem2, 
        "diem3": diem3, 
        "diem_tb": diem_tb, 
        "xep_loai": xep_loai 
} 
def nhap_danh_sach_hoc_vien(n): 
    danh_sach = [] 
    for i in range(n): 
        print(f"\n=== Nhập học viên {i+1}/{n} ===") 
        hv = nhap_hoc_vien()  # Gọi Nhiệm vụ 3 
        danh_sach.append(hv) 
    return danh_sach
def nhap_danh_sach_hoc_vien(n):
    danh_sach = []
    for i in range(n):
        print(f"\n{COLOR_TITLE}=== Nhập học viên {i + 1}/{n} ==={COLOR_RESET}")
        hv = nhap_hoc_vien()
        danh_sach.append(hv)
    return danh_sach
 
 
def in_danh_sach(danh_sach):
    if not danh_sach:
        print(f"{COLOR_WARN}(Danh sách rỗng - chưa có học viên nào){COLOR_RESET}")
        return
 
    header = f"{'STT':<5}{'Tên':<20}{'Mã SV':<10}{'Điểm 1':<8}{'Điểm 2':<8}{'Điểm 3':<8}{'Điểm TB':<9}{'Xếp loại':<10}"
    print(COLOR_TITLE + header + COLOR_RESET)
    print("-" * len(header))
 
    for idx, hv in enumerate(danh_sach, start=1):
        print(f"{idx:<5}{hv['ten']:<20}{hv['ma_sv']:<10}"
              f"{hv['diem1']:<8}{hv['diem2']:<8}{hv['diem3']:<8}"
              f"{hv['diem_tb']:<9}{hv['xep_loai']:<10}")
 
def thong_ke(danh_sach):
    if not danh_sach:
        return {
            "diem_tb_chung": 0.0,
            "diem_cao_nhat": 0.0,
            "diem_thap_nhat": 0.0,
            "so_luong_xep_loai": {}
        }
 
    diem_tb_list = [hv["diem_tb"] for hv in danh_sach]
    diem_tb_chung = round(sum(diem_tb_list) / len(diem_tb_list), 2)
    diem_cao_nhat = max(diem_tb_list)
    diem_thap_nhat = min(diem_tb_list)
 
    so_luong_xep_loai = {"Xuất sắc": 0, "Giỏi": 0, "Khá": 0, "Trung bình": 0, "Yếu": 0}
    for hv in danh_sach:
        so_luong_xep_loai[hv["xep_loai"]] += 1
 
    return {
        "diem_tb_chung": diem_tb_chung,
        "diem_cao_nhat": diem_cao_nhat,
        "diem_thap_nhat": diem_thap_nhat,
        "so_luong_xep_loai": so_luong_xep_loai
    }
 
 
def sap_xep_theo_diem(danh_sach):
    """Sắp xếp danh sách học viên theo điểm trung bình giảm dần."""
    return sorted(danh_sach, key=lambda hv: hv["diem_tb"], reverse=True)
 
 
def in_thong_ke(stats):
    """In báo cáo thống kê."""
    print(f"\n{COLOR_TITLE}--- THỐNG KÊ KẾT QUẢ TOÀN LỚP ---{COLOR_RESET}")
    print(f"Điểm trung bình chung : {stats['diem_tb_chung']}")
    print(f"Điểm cao nhất         : {stats['diem_cao_nhat']}")
    print(f"Điểm thấp nhất        : {stats['diem_thap_nhat']}")
    print("Số học viên theo xếp loại:")
    for loai, so_luong in stats["so_luong_xep_loai"].items():
        print(f"  - {loai}: {so_luong} học viên")
 

def tim_hoc_vien_theo_ten(danh_sach, ten):
    """Tìm học viên theo tên, không phân biệt hoa/thường."""
    ten_chuan_hoa = ten.strip().lower()
    ket_qua = [hv for hv in danh_sach if hv["ten"].strip().lower() == ten_chuan_hoa]
 
    if not ket_qua:
        print(f"{COLOR_WARN}Không tìm thấy học viên có tên '{ten}'.{COLOR_RESET}")
    else:
        print(f"{COLOR_OK}Tìm thấy {len(ket_qua)} học viên:{COLOR_RESET}")
        in_danh_sach(ket_qua)
    return ket_qua
 
 
def xuat_csv(danh_sach, ten_file):
    """Lưu toàn bộ thông tin bảng điểm vào tập tin CSV chuẩn hóa."""
    if not danh_sach:
        print(f"{COLOR_WARN}Danh sách rỗng, không có dữ liệu để xuất.{COLOR_RESET}")
        return
 
    cot = ["ten", "ma_sv", "diem1", "diem2", "diem3", "diem_tb", "xep_loai"]
    try:
        with open(ten_file, mode="w", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=cot)
            writer.writeheader()
            for hv in danh_sach:
                writer.writerow(hv)
        print(f"{COLOR_OK}✔ Đã xuất dữ liệu ra file '{ten_file}' thành công.{COLOR_RESET}")
    except OSError as e:
        print(f"{COLOR_ERR}✘ Lỗi khi ghi file: {e}{COLOR_RESET}")
 
 
def tim_hoc_vien_xuat_sac(danh_sach):
    """Lọc và in riêng danh sách các học viên đạt xếp loại 'Xuất sắc'."""
    xuat_sac = [hv for hv in danh_sach if hv["xep_loai"] == "Xuất sắc"]
    print(f"\n{COLOR_TITLE}--- DANH SÁCH HỌC VIÊN XUẤT SẮC ---{COLOR_RESET}")
    in_danh_sach(xuat_sac)
    return xuat_sac
 

def nhap_so_nguyen_hop_le(prompt):
    while True:
        try:
            gia_tri = int(input(prompt))
            if gia_tri < 0:
                print(f"{COLOR_WARN}⚠ Số lượng không được âm, vui lòng nhập lại.{COLOR_RESET}")
                continue
            return gia_tri
        except ValueError:
            print(f"{COLOR_ERR}✘ Vui lòng nhập một số nguyên hợp lệ.{COLOR_RESET}")
 
 
def main():
    print(COLOR_TITLE + "=" * 50)
    print(" HỆ THỐNG QUẢN LÝ ĐIỂM HỌC VIÊN - ĐH AN GIANG")
    print("=" * 50 + COLOR_RESET + "\n")
 
    n = nhap_so_nguyen_hop_le("Nhập số lượng học viên: ")
    danh_sach = nhap_danh_sach_hoc_vien(n)
 
    print(f"\n{COLOR_TITLE}--- DANH SÁCH BAN ĐẦU ---{COLOR_RESET}")
    in_danh_sach(danh_sach)
 
    danh_sach_sorted = sap_xep_theo_diem(danh_sach)
    print(f"\n{COLOR_TITLE}--- DANH SÁCH SAU SẮP XẾP (ĐIỂM GIẢM DẦN) ---{COLOR_RESET}")
    in_danh_sach(danh_sach_sorted)
 
    stats = thong_ke(danh_sach)
    in_thong_ke(stats)
 
    
    tim_hoc_vien_xuat_sac(danh_sach)
 
    if danh_sach:
        ten_tim = input("\nNhập tên học viên cần tìm kiếm (Enter để bỏ qua): ").strip()
        if ten_tim:
            tim_hoc_vien_theo_ten(danh_sach, ten_tim)
 
        xuat = input("Bạn có muốn xuất dữ liệu ra file CSV không? (y/n): ").strip().lower()
        if xuat == "y":
            xuat_csv(danh_sach, "bang_diem.csv")
 
    print(f"\n{COLOR_OK}Cảm ơn bạn đã sử dụng hệ thống!{COLOR_RESET}")
 
 
if __name__ == "__main__":
    main()